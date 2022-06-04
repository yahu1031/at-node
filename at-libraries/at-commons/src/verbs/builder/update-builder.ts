import { Metadata } from "../../keystore";
import { AT_KEY, AT_SIGN, AT_TTB, AT_TTL, AT_TTR, AT_VALUE, CCD, FOR_AT_SIGN, IS_BINARY, IS_ENCRYPTED, PUBLIC_DATA_SIGNATURE, SHARED_KEY_ENCRYPTED, SHARED_WITH_PUBLIC_KEY_CHECK_SUM, UpdateParams, UPDATE_META, VerbSyntax, VerbUtil } from "../../utils";
import { VerbBuilder } from ".";

/**
 *  Update builder generates a command to update `value` for a key `atKey` in the secondary server of `sharedBy`.
 *  Use `getBuilder` method if you want to convert command to a builder.
 * 
 * ```ts
 * // setting a public value for the key 'phone'
 * var updateBuilder = new UpdateVerbBuilder();
 * updateBuilder.isPublic = true,
 * updateBuilder.key = 'phone',
 * updateBuilder.sharedBy = 'bob',
 * updateBuilder.value = '+1-1234';
 *
 * // @bob setting a value for the key 'phone' to share with @alice
 * var updateBuilder = new UpdateVerbBuilder();
 * updateBuilder.sharedWith = '@alice';
 * updateBuilder.key = 'phone';
 * updateBuilder.sharedBy = 'bob';
 * updateBuilder.value = '+1-5678';
 * ```
 */
export class UpdateVerbBuilder implements VerbBuilder {

    /**
     * Key that represents a user's information. e.g phone, location, email etc.,
     */
    public atKey?: string;

    /**
     * Value of the key typically in string format.Images, files, etc.,
     * must be converted to unicode string before storing.
     */
    public value?: any;

    /**
     * AtSign to whom AtKey has to be shared.
     */
    public sharedWith?: string;

    /**
     * AtSign of the client user calling this builder.
     */
    public sharedBy?: string;

    /**
     * if isPublic is true, then AtKey is accessible by all atSigns.
     * if isPublic is false, then AtKey is accessible either by sharedWith or sharedBy
     */
    public isPublic: boolean = false;

    /**
     * Time in milliseconds after which AtKey expires.
     */
    public ttl?: number | null;

    /**
     * Time in milliseconds after which AtKey becomes active.
     */
    public ttb?: number | null;

    /**
     * Time in milliseconds to refresh AtKey.
     */
    public ttr?: number | null;

    /**
     * boolean variable to enable / disable cascade delete
     */
    public ccd?: boolean | false;

    public isBinary?: boolean | false;

    /** 
     * boolean variable to indicate if the value is encrypted.
     * True indicates encrypted value
     * False indicates unencrypted value
     */
    public isEncrypted?: boolean | false;

    /**
     * Signed signature with atsign's private key, if isPublic is true
     */
    public dataSignature?: string | null;

    /**
     * Operation of update verb builder
     */
    public operation?: string | null;

    public isJson: boolean = false;

    public sharedKeyStatus?: string | null;

    /**
     * Will be set only when[sharedWith] is set.Will be encrypted using the public key of[sharedWith] atsign
     */
    public sharedKeyEncrypted?: string | null;

    /**
     * checksum of the the public key of[sharedWith] atsign.Will be set only when[sharedWith] is set.
     */
    public pubKeyChecksum?: string | null;

    public buildCommand(): string {
        if (this.isJson) {
            var updateParams = new UpdateParams();
            var key = '';
            if (this.sharedWith !== null && this.sharedWith) {
                key += `${VerbUtil.formatAtSign(this.sharedWith)}:`;
            }
            key += this.atKey;
            if (this.sharedBy !== null && this.sharedBy) {
                key += `${VerbUtil.formatAtSign(this.sharedBy)}`;
            }
            updateParams.atKey = key;
            updateParams.value = this.value;
            updateParams.sharedBy = this.sharedBy;
            updateParams.sharedWith = this.sharedWith;
            var metadata = new Metadata();
            metadata.ttb = this.ttb ?? null;
            metadata.ttl = this.ttl ?? null;
            metadata.ttr = this.ttr ?? null;
            metadata.isBinary = this.isBinary ?? false;
            metadata.dataSignature = this.dataSignature ?? null;
            metadata.isEncrypted = this.isEncrypted ?? false;
            metadata.ccd = this.ccd ?? false;
            metadata.isPublic = this.isPublic;
            metadata.sharedKeyEnc = this.sharedKeyEncrypted ?? null;
            metadata.sharedkeyStatus = this.sharedKeyStatus ?? null;
            updateParams.metadata = metadata;
            var json = updateParams.toJson();
            var command = `update:json:${JSON.stringify(json)}\n`;
            return command;
        }
        var command = 'update:';
        if (this.ttl !== null && this.ttl) {
            command += `ttl:${this.ttl}:`;
        }
        if (this.ttb !== null && this.ttb) {
            command += `ttb:${this.ttb}:`;
        }
        if (this.ttr != null) {
            command += `ttr:${this.ttr}:`;
        }
        if (this.ccd != null) {
            command += `ccd:${this.ccd}:`;
        }
        if (this.dataSignature != null) {
            command += `dataSignature:${this.dataSignature}:`;
        }
        if (this.isBinary != null) {
            command += `isBinary:${this.isBinary}:`;
        }
        if (this.isEncrypted != null) {
            command += `isEncrypted:${this.isEncrypted}:`;
        }
        if (this.sharedKeyEncrypted != null) {
            command += `${SHARED_KEY_ENCRYPTED}:${this.sharedKeyEncrypted}:`;
        }
        if (this.pubKeyChecksum != null) {
            command += `${SHARED_WITH_PUBLIC_KEY_CHECK_SUM}:${this.pubKeyChecksum}:`;
        }
        if (this.isPublic) {
            command += 'public:';
        } else if (this.sharedWith != null) {
            command += `${VerbUtil.formatAtSign(this.sharedWith)}:`;
        }
        command += this.atKey!;

        if (this.sharedBy != null) {
            command += `${VerbUtil.formatAtSign(this.sharedBy)}`;
        }
        if (typeof (this.value) === 'string') {
            this.value = VerbUtil.replaceNewline(this.value);
        }
        command += ` ${this.value}\n`;
        return command;
    }

    public checkParams(): boolean {
        return !((this.atKey === null || this.value === null) ||
            (this.isPublic === true && this.sharedWith !== null));
    }

    private static _getBoolVerbParams(arg1: string): boolean {
        return arg1.toLowerCase() === 'true';
    }

    static getBuilder(command: string): UpdateVerbBuilder | null {
        var builder = new UpdateVerbBuilder();
        var verbParams: Map<string, string | null> | null = new Map<string, string | null>();
        if (command.includes(UPDATE_META)) {
            verbParams = VerbUtil.getVerbParam(VerbSyntax.update_meta, command);
            builder.operation = UPDATE_META;
        } else {
            verbParams = VerbUtil.getVerbParam(VerbSyntax.update, command);
        }
        if (verbParams == null) {
            return null;
        }
        builder.isPublic = command.includes('public:');
        builder.sharedWith = VerbUtil.formatAtSign(verbParams.get(FOR_AT_SIGN)!)!;
        builder.sharedBy = VerbUtil.formatAtSign(verbParams.get(AT_SIGN)!)!;
        builder.atKey = verbParams.get(AT_KEY)!;
        builder.value = verbParams.get(AT_VALUE)!;
        if (typeof (builder.value) === 'string') {
            builder.value = VerbUtil.replaceNewline(builder.value);
        }
        if (verbParams.get(AT_TTL) != null) {
            builder.ttl = parseInt(verbParams.get(AT_TTL)!);
        }
        if (verbParams.get(AT_TTB) != null) {
            builder.ttb = parseInt(verbParams.get(AT_TTB)!);
        }
        if (verbParams.get(AT_TTR) != null) {
            builder.ttr = parseInt(verbParams.get(AT_TTR)!);
        }
        if (verbParams.get(CCD) != null) {
            builder.ccd = this._getBoolVerbParams(verbParams.get(CCD)!);
        }
        if (verbParams.get(PUBLIC_DATA_SIGNATURE) != null) {
            builder.dataSignature = verbParams.get(PUBLIC_DATA_SIGNATURE)!;
        }
        if (verbParams.get(IS_BINARY) != null) {
            builder.isBinary = this._getBoolVerbParams(verbParams.get(IS_BINARY)!);
        }
        if (verbParams.get(IS_ENCRYPTED) != null) {
            builder.isEncrypted = this._getBoolVerbParams(verbParams.get(IS_ENCRYPTED)!);
        }
        if (verbParams.get(SHARED_KEY_ENCRYPTED) != null) {
            builder.sharedKeyEncrypted = verbParams.get(SHARED_KEY_ENCRYPTED)!;
        }
        if (verbParams.get(SHARED_WITH_PUBLIC_KEY_CHECK_SUM) != null) {
            builder.sharedKeyEncrypted = verbParams.get(SHARED_WITH_PUBLIC_KEY_CHECK_SUM)!;
        }
        return builder;
    }

    public buildCommandForMeta(): string {
        var command = 'update:meta:';
        if (this.isPublic) {
            command += 'public:';
        } else if (this.sharedWith !== null) {
            command += `${VerbUtil.formatAtSign(this.sharedWith)}:`;
        }
        command += this.atKey!;
        if (this.sharedBy != null) {
            command += `${VerbUtil.formatAtSign(this.sharedBy)}`;
        }
        if (this.ttl !== null && this.ttl) {
            command += `:ttl:${this.ttl}:`;
        }
        if (this.ttb !== null && this.ttb) {
            command += `:ttb:${this.ttb}:`;
        }
        if (this.ttr != null) {
            command += `:ttr:${this.ttr}:`;
        }
        if (this.ccd != null) {
            command += `:ccd:${this.ccd}:`;
        }
        if (this.isBinary != null) {
            command += `:isBinary:${this.isBinary}:`;
        }
        if (this.isEncrypted != null) {
            command += `:isEncrypted:${this.isEncrypted}:`;
        }
        if (this.sharedKeyEncrypted != null) {
            command += `:${SHARED_KEY_ENCRYPTED}:${this.sharedKeyEncrypted}:`;
        }
        if (this.pubKeyChecksum != null) {
            command += `:${SHARED_WITH_PUBLIC_KEY_CHECK_SUM}:${this.pubKeyChecksum}:`;
        }
        command += `\n`;
        return command;
    }

}