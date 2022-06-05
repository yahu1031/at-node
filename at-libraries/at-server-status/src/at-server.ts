import { AtLookup } from "@sign/at-lookup";
import { AtLogger } from "@sign/at-utils";
import { AtStatus } from "./model/at-status";
import { RootStatus, ServerStatus } from "./utils/status-enum";

export class AtServerStatus {
    _rootUrl!: string | null;
    _rootPort!: number | null;
    private _logger = new AtLogger('AtServerStatus');

    get rootUrl(): string | null {
        return this._rootUrl;
    }

    set rootUrl(value: string | null) {
        this._rootUrl = value ?? 'root.atsign.org';
    }

    get rootPort(): number | null {
        return this._rootPort;
    }

    set rootPort(value: number | null) {
        this._rootPort = value ?? 64;
    }

    constructor({ rootUrl, rootPort }: { rootUrl?: string | null, rootPort?: number | null }) {
        this.rootUrl = rootUrl ?? 'root.atsign.org';
        this._rootUrl = this.rootUrl;
        this.rootPort = rootPort ?? 64;
        this._rootPort = this.rootPort;
    }

    async getStatus(atSign: string): Promise<AtStatus> { 
        atSign = atSign.toLowerCase().startsWith('@') ? atSign : `@${atSign.toLowerCase()}`;
        var atStatus: AtStatus = new AtStatus({ atSign: atSign });
        try {
            var rootStatus = await this._getRootStatus(atSign);
            atStatus.rootStatus = rootStatus.rootStatus;
            atStatus.serverLocation = rootStatus.serverLocation;
            if (atStatus.rootStatus == RootStatus.found && atStatus.serverLocation !== null && atStatus.serverLocation!.length !== 0) {
                await this._getServerStatus(atSign, atStatus.serverLocation!).then((atStatus) => {
                    atStatus.serverStatus = rootStatus.serverStatus;
                }).catch((e) => {
                    this._logger.error(e);
                    atStatus.serverStatus = ServerStatus.unavailable;
                });
            }
        } catch (e) {
            this._logger.error(e);
            atStatus.rootStatus = RootStatus.unavailable;
        }
        return atStatus;
    }

    private async _getServerStatus(atSign: string | null, serverLocation: string | null): Promise<AtStatus> {
        if (atSign == null || serverLocation == null) { 
            return new AtStatus({ atSign: atSign, serverLocation: serverLocation, rootStatus: RootStatus.notFound });
        }
        var atStatus: AtStatus = new AtStatus({ atSign: atSign, serverLocation: serverLocation });
        var _testPublicKey = `public${atSign}`;
        if (serverLocation == null || serverLocation.length === 0) {
            atStatus.rootStatus = RootStatus.notFound;
        } else {
            var atLookup: AtLookup = new AtLookup(atSign!, this.rootUrl!, this.rootPort!);
            try {
                var results = await atLookup.scan('', '', false);
                results.forEach(async result => {
                    if (result.includes(_testPublicKey)) {
                        var _value = await atLookup.lookup('publickey', atSign, false);
                        _value = _value.replace('data:', '');
                        if (_value !== 'null') {
                            atStatus.serverStatus = ServerStatus.activated;
                        } else {
                            atStatus.serverStatus = ServerStatus.ready;
                        }
                    } else {
                        atStatus.serverStatus = ServerStatus.teapot;
                    }
                });
            } catch (e) { 
                atStatus.rootStatus = RootStatus.unavailable;
                this._logger.error(e);
            }
            await atLookup.close();
         }
        return atStatus;
    }

    private async _getRootStatus(atSign: string): Promise<AtStatus> {
        var atStatus: AtStatus = new AtStatus({ atSign: atSign });
        try {
            var secondary = await new AtLookup(atSign).findSecondary(atSign);
            if (secondary == null) {
                atStatus.rootStatus = RootStatus.notFound;
            } else {
                atStatus.rootStatus = RootStatus.found;
                atStatus.serverLocation = secondary;
            }
        } catch (e) {
            this._logger.error(e);
            atStatus.rootStatus = RootStatus.unavailable;
        }
        return atStatus;
     }

}