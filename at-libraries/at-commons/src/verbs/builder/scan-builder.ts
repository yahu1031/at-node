import { VerbUtil } from "../../utils";
import { VerbBuilder } from ".";

/**
 * Scan verb builder generates a command to scan keys of current atSign(with ot without auth).
 * If a [regex] is set, keys matching the regex are returned.
 * If a [sharedBy] is set, then a scan command is send to the secondary server of the [sharedBy].
 * If a [sharedWith] is set, gets the keys shared to [sharedWith] atSign from the current atSign.
 * ```ts
 * // Scans keys for the self in an unauthenticated way
 * var builder = new ScanVerbBuilder();
 *
 * // Scans keys for the self in an authenticated way
 * builder.auth=true;
 *
 * // Scans keys shared by @alice to self in an authenticated way
 * builder.auth=true
 * builder.forAtSign='alice';
 * 
 * // Scans keys shared with @alice by self in an authenticated way
 * builder.auth=true;
 * builder.regex='@alice';
 * ```
 */
export class ScanVerbBuilder implements VerbBuilder {
    /**
     *  atSign of another secondary server on which scan is run.
     *  If [sharedBy] is set then [auth] has to be true.
     */
    sharedBy?: string | null;

    /** 
     * atSign to whom the current atClient user has shared the keys.
     * If [sharedWith] is set then [auth] has to be true.
     */
    sharedWith?: string | null;

    /**
     * If set to true, then all keys(public, private, protected) are returned.
     * If set to false, only the public keys of current atSign are returned.
     */
    auth: boolean = false;

    /**
     * Regular expression to filter keys.
     */
    regex?: RegExp | string | null;

    public buildCommand(): string {
        var scanCommand = 'scan';
        if (this.sharedBy != null) {
            scanCommand += `:${VerbUtil.formatAtSign(this.sharedBy)}`;
        }
        if (this.regex != null) {
            scanCommand += ` ${this.regex}`;
        }
        scanCommand += '\n';
        return scanCommand;
    }

    public checkParams(): boolean {
        return true;
    }
}
