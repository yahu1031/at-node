import { AtSignStatus, RootStatus, ServerStatus } from "../utils/status-enum";
/**
 * Status of an `@sign`
 *   @param atSign
 *   @param serverLocation
 *   @param rootStatus
 *   @param serverStatus
 *   @param atSignStatus
 *
 * The AtSignStatus values returned by status() and their meanings are:
 *
 * `AtSignStatus.notFound` - The server has no root location
 *
 * `AtSignStatus.ready` - The server has root location, is running and ready for activation
 *
 * `AtSignStatus.teapot` - server has root location, is running but is not activated
 *
 * `AtSignStatus.activated` - server has root location, is running and is activated
 *
 * `AtSignStatus.unavailable` - Either the root or server is not currently available
 *
 * `AtSignStatus.error` - There was an error encountered by this library
 *
 * ---
 * 
 * The HttpStatus codes returned by httpStatus() and their meanings are:
 *
 * `404` - server has no root location, is not running and is not activated
 *
 * `503` - server has root location, is not running and is not activated
 *
 * `418` - server has root location, is running and but not activated
 *
 * `200` - server has root location, is running and is activated
 *
 * `500` - at_find_api internal error
 *
 * `502` - root server is down
 */
export class AtStatus {

    atSign?: string | null;

    serverLocation?: string | null;

    rootStatus?: RootStatus | null;

    serverStatus?: ServerStatus | null;

    atSignStatus?: AtSignStatus | null;

    // constructor with named parameters
    constructor({ atSign, serverLocation, rootStatus, serverStatus, atSignStatus }: { atSign?: string | null, serverLocation?: string | null, rootStatus?: RootStatus | null, serverStatus?: ServerStatus | null, atSignStatus?: AtSignStatus | null } = {}) {
        this.atSign = atSign;
        this.serverLocation = serverLocation;
        this.rootStatus = rootStatus;
        this.serverStatus = serverStatus;
        this.atSignStatus = atSignStatus;
    }

    /** 
     * status() returns an enumerated AtSignStatus value of the overall status of an @sign
     */
    public status(): AtSignStatus | null {
        var status: AtSignStatus | null = null;
        if (this.rootStatus === RootStatus.notFound) {
            status = AtSignStatus.notFound;
        } else if (this.rootStatus === RootStatus.found) {
            if (this.serverStatus === ServerStatus.activated) {
                status = AtSignStatus.activated;
            }
            else if (this.serverStatus === ServerStatus.ready || this.serverStatus === ServerStatus.teapot) {
                status = AtSignStatus.teapot;
            }
        } else if (this.rootStatus === RootStatus.unavailable || this.rootStatus === RootStatus.stopped || this.serverStatus === ServerStatus.stopped || this.serverStatus === ServerStatus.unavailable) {
            status = AtSignStatus.unavailable;
        }
        return status;
    }

    /** 
     * returns an integer HttpStatus code of the overall status of an @sign
     */
    public httpStatus(): number {
        var status: number;
        if (this.rootStatus === RootStatus.notFound) {
            status = this._serverHttpStatus();
        } else {
            status = this._rootHttpStatus();
        }
        return status;
    }

    private _rootHttpStatus(): number {
        var status: number;
        if (this.rootStatus == RootStatus.found) {
            status = 302;
        } else if (this.rootStatus == RootStatus.notFound) {
            status = 404;
        } else if (this.rootStatus == RootStatus.stopped) {
            status = 503;
        } else if (this.rootStatus == RootStatus.unavailable) {
            status = 503;
        } else {
            status = 500;
        }
        return status;
    }

    private _serverHttpStatus(): number {
        var status: number;
        if (this.serverStatus === ServerStatus.teapot) {
            status = 418;
        } else if (this.serverStatus === ServerStatus.stopped || this.serverStatus === ServerStatus.unavailable) {
            status = 404;
        } else if (this.serverStatus === ServerStatus.ready) {
            status = 206;
        } else if (this.serverStatus === ServerStatus.activated) {
            status = 200;
        } else {
            status = 500;
        }
        return status;
    }

    public toJson(): Map<string, any> {
        var json: Map<string, any> = new Map<string, any>();
        json.set("atSign", this.atSign);
        json.set("serverLocation", this.serverLocation);
        json.set("rootStatus", this.rootStatus);
        json.set("serverStatus", this.serverStatus);
        json.set("atSignStatus", this.atSignStatus);
        return json;
    }

    public toString(): string {
        return JSON.stringify(this.toJson());
    }
}
