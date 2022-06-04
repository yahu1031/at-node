import { VerbUtil } from "../../utils";
import { VerbBuilder } from ".";

/**
 * Plookup builder generates a command to lookup public value of [atKey] on secondary server of another atSign [sharedBy].
 * 
 * e.g If @alice has a public key - `public:phone@alice` then use this builder to
 * lookup value of `phone@alice` from bob's secondary
 * 
 * ```ts
 * var builder = new PlookupVerbBuilder();
 * builder.key='phone';
 * builder.atSign='alice';
 * ```
 */
export class PLookupVerbBuilder implements VerbBuilder {
    /**
     * Key of the[sharedBy] to lookup. [atKey] must have public access.
     */
    atKey?: string | null;

    /**
     * atSign of the secondary server on which plookup has to be executed.
     */
    sharedBy?: string | null;

    operation?: string | null;

    /**
     * If set to true, returns the value of key on the remote server instead of the cached copy
     */
    byPassCache = false;

    buildCommand(): string {
        var command = 'plookup:';
        if (this.byPassCache == true) {
            command += `bypassCache:${this.byPassCache}:`;
        }
        if (this.operation != null) {
            command += `${this.operation}:`;
        }
        command += this.atKey!;
        return `${command}${VerbUtil.formatAtSign(this.sharedBy!)}\n`;
    }

    checkParams() {
        return this.atKey != null && this.sharedBy != null;
    }
}
