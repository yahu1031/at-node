import { ConfigVerbBuilder, DeleteVerbBuilder, LLookupVerbBuilder, LookupVerbBuilder, Metadata, NotifyAllVerbBuilder, NotifyListVerbBuilder, NotifyRemoveVerbBuilder, NotifyStatusVerbBuilder, NotifyVerbBuilder, PLookupVerbBuilder, ScanVerbBuilder, SecondaryConnectError, StatsVerbBuilder, SyncVerbBuilder, UnAuthenticatedError, UpdateVerbBuilder, UPDATE_META, VerbBuilder, VerbUtil } from '@sign/at-commons';
import { AtLogger } from '@sign/at-utils';
import { md } from 'node-forge';
import { Socket } from 'node:net';
import { CacheableSecondaryAddressFinder } from '../cache/cacheable-secondary-address-finder';
import { OutboundConnection } from '../connection/outbound.connection';
import { OutboundMessageListener } from '../connection/outbound.message.listener';
import { AtLookUpError } from '../utils/error';
import { signChallenge, toPublicPem } from '../utils/helper.utils';
import { LookUpUtil } from '../utils/lookup.util';
import { Mutex } from '../utils/mutex';
import '../utils/ext.util';

abstract class AAtLookup {

    abstract update(key: string, value: string, sharedWith?: string | null, metadata?: Metadata | null): Promise<boolean>;

    abstract lookup(key: string, sharedBy: string, auth?: boolean, verifyData?: boolean): Promise<string>;

    abstract plookup(key: string, sharedBy: string): Promise<string>;

    abstract llookup(key: string, sharedBy?: string, sharedWith?: string, isPublic?: boolean): Promise<string>;

    abstract delete(key: string, sharedWith?: string, isPublic?: boolean): Promise<boolean>;

    abstract scan(regex?: RegExp | string, sharedBy?: string, auth?: boolean): Promise<string[]>;

    abstract exectureVerb(builder: VerbBuilder): Promise<string>;
}

export class AtLookup implements AAtLookup {

    private _logger = new AtLogger('AtLookup');

    private _isPkamAuthenticated = false;

    private _connection?: OutboundConnection | null;

    public get connection(): OutboundConnection {
        return this._connection!;
    }

    messageListener!: OutboundMessageListener;

    private _isCramAuthenticated = false;

    private _currentAtSign: string;
    
    private _rootDomain?: string | null;
    
    private _rootPort?: number | null;
    
    private _privateKey?: string | null;
    
    private _cramSecret?: string | null;
    
    private _mutex = new Mutex();
    
    private outboundConnectionTimeout?: number | null;

    constructor(atSign: string, rootDoamin?: string | null, rootPort?: number | null, privateKey?: string | null, cramSecret?: string | null) {
        this._currentAtSign = atSign;
        this._rootDomain = rootDoamin ?? 'root.atsign.org';
        this._rootPort = rootPort ?? 64;
        this._privateKey = privateKey ?? null;
        this._cramSecret = cramSecret ?? null;
    }

    public _isError(verbResult: string): boolean {
        return verbResult.startsWith('error:');
    }

    public isConnectionAvailable(): boolean {
        return this._connection != null && !this.isInValid();
    }

    public _isAuthRequired(): boolean {
        return !this.isConnectionAvailable() ||
            !(this._isPkamAuthenticated || this._isCramAuthenticated);
    }

    /// Generates digest using from verb response and [secret] and performs a CRAM authentication to
    /// secondary server
    public async authenticate_cram(secret: string | null): Promise<boolean> {
        secret = this._cramSecret ?? secret;
        if (secret == null) {
            throw new UnAuthenticatedError('Cram secret not passed');
        }
        await this._sendCommand(`from:${this._currentAtSign}\n`);
        var fromResponse = await this.messageListener.read();
        this._logger.info(`from result:${fromResponse}`);
        if (fromResponse.isEmpty()) {
            return false;
        }
        fromResponse = fromResponse.trim().replaceAll('data:', '');
        var digestInput = `${secret}${fromResponse}`;
        var _md = md.sha512.create();
        _md.update(digestInput, 'utf8');
        var digest = _md.digest().toHex();
        await this._sendCommand(`cram:${digest}\n`);
        var cramResponse = await this.messageListener.read();
        if (cramResponse.isEmpty()) {
            return false;
        }
        if (cramResponse.trim() === 'data:success') { 
            this._logger.info(`Cram authentication success`);
            this._isCramAuthenticated = true;
        } else {
            this._logger.error(`Cram authentication failed`);
            throw new UnAuthenticatedError(`Cram authentication failed for ${this._currentAtSign} : ${cramResponse}`);
        }
        return this._isCramAuthenticated;
    }

    private async _process(command: string, auth: boolean = false): Promise<string> {
        console.log('auth : ' + auth + ' command : ' + command);
        await this._mutex.acquire();
        if (auth && this._isAuthRequired()) {
            if (this._privateKey !== null) {
                await this.authenticate(this._privateKey!);
            } else if (this._cramSecret !== null) {
                await this.authenticate_cram(this._cramSecret!);
            } else {
                throw new UnAuthenticatedError('Unable to perform atlookup auth. Private key/cram secret is not set');
            }
        }
        try {
            await this._sendCommand(command);
            var response = await this.messageListener.read();
            return response;
        } catch (e: any) {
            this._logger.error(`Error in sending to server, ${e}`);
            throw e;
        } finally {
            this._mutex.release();
        }
    }


    public async authenticate(privateKey: string): Promise<boolean> {
        if (privateKey == null || privateKey.isEmpty() || privateKey == undefined) {
            throw new UnAuthenticatedError('Invalid private key');
        }
        await this._sendCommand(`from:${this._currentAtSign}\n`);
        var fromResponse = await this.messageListener.read();
        if (fromResponse.includes('error')) {
            throw new UnAuthenticatedError(`Failed to "from" connection : ${fromResponse}`);
        }
        if (fromResponse.isEmpty()) {
            return false;
        }
        fromResponse = fromResponse.trim().replaceAll('data:', '');
        this._logger.finer(`Form response : ${fromResponse}`);
        var signature = signChallenge(privateKey, fromResponse);
        this._logger.finer(`Signature : ${signature}`);
        await this._sendCommand(`pkam:${signature}\n`);
        var pkamResponse = await this.messageListener.read();
        if (pkamResponse === 'data:success') {
            this._logger.info('Authentication successful');
            this._isPkamAuthenticated = true;
        } else {
            throw new UnAuthenticatedError(`Failed to authenticate ${this._currentAtSign} : ${pkamResponse}`);
        }
        return this._isPkamAuthenticated;
    }

    public async findSecondary(atSign: string, rootDomain?: string, port?: number): Promise<string> {
        return await new CacheableSecondaryAddressFinder(rootDomain ?? this._rootDomain!, port ?? this._rootPort!).findSecondaryAddress(atSign);
    }

    public async createConnection(): Promise<void> {
        if (!this.isConnectionAvailable()) {
            // 1. Find the secondary url for the current atsign
            var secondaryUrl = await this.findSecondary(this._currentAtSign, this._rootDomain!, this._rootPort!);
            if (secondaryUrl == null || secondaryUrl.isEmpty()) {
                throw new Error('Unable to find secondary url');
            }
            var secondaryInfo = LookUpUtil.getSecondaryInfo(secondaryUrl);
            var host = secondaryInfo[0];
            var port = secondaryInfo[1];
            // 2. Create a connection to the secondary url
            await this.createOutBoundConnection(host, port, this._currentAtSign);
            // 3. Create a message listener
            this.messageListener = new OutboundMessageListener(this._connection!);
            this.messageListener.listen();
        }
    }

    public async createOutBoundConnection(host: string, port: string, toAtSign: string): Promise<boolean> {
        var socket = new Socket();
        try {
            socket.connect(parseInt(port), host);
            this._connection = new OutboundConnection(socket);
            if (this.outboundConnectionTimeout != null) {
                this._connection!.setIdleTime(this.outboundConnectionTimeout);
            }
        } catch (e) {
            throw new SecondaryConnectError(
                `unable to connect to secondary ${toAtSign} on ${host}:${port}`);
        }
        return true;
    }


    public async _sendCommand(command: string): Promise<void> {
        await this.createConnection();
        this._connection?.write(command);
    }

    public async update(key: string, value: string, sharedWith?: string | null, metadata?: Metadata | null): Promise<boolean> {
        var builder = new UpdateVerbBuilder();
        builder.atKey = key;
        builder.value = value;
        builder.sharedWith = sharedWith!;
        builder.sharedBy = this._currentAtSign;
        if (metadata !== null) {
            builder.ttl = metadata!.ttl!;
            builder.ttr = metadata!.ttr!;
            builder.ttb = metadata!.ttb!;
            builder.isPublic = metadata!.isPublic!;
            if (metadata?.isHidden) {
                builder.atKey = '_' + key;
            }
        }
        var updateResult = await this.exectureVerb(builder);
        return updateResult!.isNotEmpty();
    }

    public async lookup(key: string, sharedBy: string, auth?: boolean, verifyData: boolean = false, metadata?: boolean): Promise<string> {
        var builder = new LookupVerbBuilder();
        builder.atKey = key;
        builder.sharedBy = sharedBy;
        builder.auth = auth ?? true;
        builder.operation = metadata ? 'all' : null;
        if (!verifyData) {
            var lookupResult = await this.exectureVerb(builder);
            lookupResult = VerbUtil.getFormattedValue(lookupResult);
            return lookupResult;
        }
        try {
            builder = new LookupVerbBuilder();
            builder.atKey = key;
            builder.sharedBy = sharedBy;
            builder.auth = false;
            builder.operation = 'all';
            var lookupResult = await this.exectureVerb(builder);
            lookupResult = VerbUtil.getFormattedValue(lookupResult);
            lookupResult = lookupResult.replaceFirst('data:', '');
            var jsonResult = JSON.parse(lookupResult);
            this._logger.finer(`Lookup result : ${JSON.stringify(jsonResult)}`);
            var publickKeyResult = '';
            if (auth) {
                publickKeyResult = await this.plookup('publickey', sharedBy);
            }else{
                var publicKeyLookupBuilder = new LookupVerbBuilder();
                publicKeyLookupBuilder.atKey = 'publickey';
                publicKeyLookupBuilder.sharedBy = sharedBy;
                publickKeyResult = await this.exectureVerb(publicKeyLookupBuilder);
            }
            publickKeyResult = VerbUtil.getFormattedValue(publickKeyResult);
            publickKeyResult = publickKeyResult.replaceFirst('data:', '');
            this._logger.finer(`Public key of ${sharedBy} : ${publickKeyResult}`);
            var publicKey = toPublicPem(publickKeyResult);
            var signature = jsonResult['metaData']['dataSignature'];
            var value = jsonResult['data'];
            value = VerbUtil.getFormattedValue(value);
            this._logger.finer(`Value : ${value}    Signature : ${signature}`);
            var isValid = publicKey.verify(value, signature);
            this._logger.finer(`Signature is valid : ${isValid}`);
            return `data:${value}`;
        } catch (error: any) {
            this._logger.error(`Error while verify public data for key: $key sharedBy: $sharedBy exception:${error.toString()}`);
            return 'data:null';
        }
    }

    public async plookup(key: string, sharedBy: string): Promise<string> {
        var builder = new PLookupVerbBuilder();
        builder.atKey = key;
        builder.sharedBy = sharedBy;
        var plookupResult = await this.exectureVerb(builder);
        plookupResult = VerbUtil.getFormattedValue(plookupResult!);
        return plookupResult;
    }

    public async llookup(key: string, sharedBy?: string, sharedWith?: string, isPublic: boolean = false): Promise<string> {
        var builder = new LLookupVerbBuilder();
        if (sharedWith !== null) {
            builder.sharedWith = sharedWith!;
            builder.isPublic = isPublic;
            builder.atKey = key;
            builder.sharedBy = sharedBy!;
        } else if (isPublic && sharedBy === null && sharedWith === null) {
            builder.atKey = 'public:' + key;
            builder.sharedBy = this._currentAtSign;
        } else {
            builder.atKey = key;
            builder.sharedBy = this._currentAtSign;
        }
        var llookupResult = await this.exectureVerb(builder);
        llookupResult = VerbUtil.getFormattedValue(llookupResult!);
        return llookupResult;
    }

    public async delete(key: string, sharedWith?: string, isPublic: boolean = false): Promise<boolean> {
        var builder = new DeleteVerbBuilder();
        builder.isPublic = isPublic;
        builder.atKey = key;
        builder.sharedWith = sharedWith!;
        builder.sharedBy = this._currentAtSign;
        var deleteResult = await this.exectureVerb(builder);
        return deleteResult!.isNotEmpty();
    }

    public async scan(regex?: string | RegExp, sharedBy?: string, auth?: boolean): Promise<string[]> {
        var builder = new ScanVerbBuilder();
        builder.regex = regex!;
        builder.auth = auth ?? false;
        builder.sharedBy = sharedBy!;
        var scanResult = await this.exectureVerb(builder);
        if (scanResult.isNotEmpty()) {
            scanResult = scanResult!.replaceFirst('data:', '');
        }
        return scanResult.isNotEmpty() ? Array.from(JSON.parse(scanResult)) : [];
    }

    /**
     *  Executes the command returned by [VerbBuilder] build command on a remote secondary server.
     * Optionally [privateKey] is passed for verb builders which require authentication.
     * 
     * Catches any exception and throws [AtLookUpException]
     */
    public async exectureVerb(builder: VerbBuilder): Promise<string> {
        var verbResult: string = '';
        try {
            if (builder instanceof UpdateVerbBuilder) {
                verbResult = await this._update(builder);
            }
            if (builder instanceof DeleteVerbBuilder) {
                verbResult = await this._delete(builder);
            }
            if (builder instanceof LookupVerbBuilder) {
                verbResult = await this._lookup(builder);
            }
            if (builder instanceof LLookupVerbBuilder) {
                verbResult = await this._llookup(builder);
            }
            if (builder instanceof PLookupVerbBuilder) {
                verbResult = await this._plookup(builder);
            }
            if (builder instanceof ScanVerbBuilder) {
                verbResult = await this._scan(builder);
            }
            if (builder instanceof StatsVerbBuilder) {
                verbResult = await this._stats(builder);
            }
            if (builder instanceof ConfigVerbBuilder) {
                verbResult = await this._config(builder);
            }
            if (builder instanceof NotifyVerbBuilder) {
                verbResult = await this._notify(builder);
            }
            if (builder instanceof NotifyStatusVerbBuilder) {
                verbResult = await this._notifyStatus(builder);
            }
            if (builder instanceof NotifyListVerbBuilder) {
                verbResult = await this._notifyList(builder);
            }
            if (builder instanceof NotifyAllVerbBuilder) {
                verbResult = await this._notifyAll(builder);
            }
            if (builder instanceof SyncVerbBuilder) {
                verbResult = await this._sync(builder);
            }
            if (builder instanceof NotifyRemoveVerbBuilder) {
                verbResult = await this._notifyRemove(builder);
            }
        } catch (e: any) {
            this._logger.error('Exception in executeVerb() : ' + e.toString());
            throw new AtLookUpError(e.toString());
        }
        if (verbResult.isEmpty()) {
            throw new AtLookUpError('Request timed out');
        }
        if (this._isError(verbResult)) {
            verbResult = verbResult.replaceAll('error:', '');
            var _errorCode = 'AT0014';
            var _errorDescription = 'Unknown server error';
            if (verbResult.includes('-')) {
                if (verbResult.split('-')[0].isNotEmpty()) {
                    _errorCode = verbResult.split('-')[0];
                }
                if (verbResult.split('-')[1].isNotEmpty()) {
                    _errorDescription = verbResult.split('-')[1];
                }
            }
            throw new AtLookUpError(_errorCode, _errorDescription);
        }
        return verbResult;
    }


    private async _update(builder: UpdateVerbBuilder): Promise<string> {
        let atCommand;
        if (builder.operation === UPDATE_META) {
            atCommand = builder.buildCommandForMeta();
        } else {
            atCommand = builder.buildCommand();
        }
        this._logger.finer('updated to remote : ' + atCommand);
        return await this._process(atCommand, true);
    }

    private async _delete(builder: DeleteVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _lookup(builder: LookupVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, builder.auth);
    }

    private async _llookup(builder: LLookupVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _plookup(builder: PLookupVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _scan(builder: ScanVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, builder.auth);
    }

    private async _stats(builder: StatsVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _notify(builder: NotifyVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _config(builder: ConfigVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _notifyStatus(builder: NotifyStatusVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _notifyList(builder: NotifyListVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _notifyAll(builder: NotifyAllVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _notifyRemove(builder: NotifyRemoveVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    private async _sync(builder: SyncVerbBuilder): Promise<string> {
        var atCommand = builder.buildCommand();
        return await this._process(atCommand, true);
    }

    public isInValid(): boolean {
        return this._connection!.isInValid();
    }

    public async close(): Promise<void> {
        await this._connection!.close();
     }
}
