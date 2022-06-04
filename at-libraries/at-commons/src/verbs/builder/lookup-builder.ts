import { VerbUtil } from "../../utils";
import { VerbBuilder } from ".";
// import '../../utils/ext.util';

/** 
 * Lookup verb builder generates a command to lookup `atKey` on either the client user's secondary server (without authentication)
 * or secondary server of `sharedBy` (with authentication).
 * 
 * Assume `@bob` is the client atSign. `@alice` is atSign on another secondary server.
 * 
 * **EG:** if you want to lookup `@bob:phone@alice` on alice's secondary,
 * user this builder to lookup value of `phone@alice` from bob's secondary. Auth has to be true.
 * 
 * ```ts
 * var builder = new LookupVerbBuilder();
 * builder.key='phone';
 * builder.atSign='alice';
 * builder.auth=true;
 * ```
 *
 * e.g if you want to lookup public key on bob's secondary without auth from bob's client.
 * ```ts
 * var builder = new LookupVerbBuilder();
 * builder.key='phone';
 * builder.atSign='bob';
 * ```
 */
export class LookupVerbBuilder implements VerbBuilder {
    /**
     * The key of `atKey` to lookup. `atKey` should not have private access.
     */
    atKey?: string | null;

    /**
     * atSign of the secondary server on which lookup has to be executed.
     */
    sharedBy?: string | null;

    /** 
     * Flag to specify whether to run this builder with or without auth.
     */
    auth: boolean = false;

    operation?: string | null;

    /**
     * If set to true, returns the value of key on the remote server instead of the cached copy.
     */
    byPassCache: boolean = false;

    buildCommand(): string {
        var command = 'lookup:';
        if (this.byPassCache == true) {
            command += `bypassCache:${this.byPassCache}:`;
        }
        if (this.operation != null) {
            command += `${this.operation}:`;
        }
        command += this.atKey!;
        return `${command}${VerbUtil.formatAtSign(this.sharedBy!)}\n`;
    }

    checkParams(): boolean {
        return this.atKey != null && this.atKey.isNotEmpty() && this.sharedBy != null && this.sharedBy.isNotEmpty();
    }
}
