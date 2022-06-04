import { VerbUtil } from "../../utils";
import { VerbBuilder } from ".";
// import '../../utils/ext.util';

/** Local lookup verb builder generates a command to lookup value of [atKey] stored in the secondary server.
 * 
 * e.g llookup key shared with alice
 * ```ts
 * // Lookup phone number available only to alice
 * var builder = new LlookupVerbBuilder();
 * builder.key='@alice:phone';
 * builder.atSign='bob';
 * ```
 * 
 * e.g llookup public key
 * ```ts
 * // Lookup email value that is available to everyone
 * var builder = new LlookupVerbBuilder();
 * builder.key='public:email';
 * builder.atSign='bob';
 * ```
 * 
 * e.g llookup private key
 * ```ts
 * // Lookup a credit card number that is accessible only by Bob
 * var builder = new LlookupVerbBuilder();
 * builder.key='@bob:credit_card';
 * builder.atSign='bob';
 * ```
 */
export class LLookupVerbBuilder implements VerbBuilder {
    /**
     * The key of `atKey` to llookup. `atKey` can have either public, private or shared access.
     */
    atKey?: string | null;

    /**
     * atSign of the secondary server on which llookup has to be executed.
     */
    sharedBy?: string | null;

    /**
     * atSign of the secondary server for whom `atKey` is shared
    */
    sharedWith?: string | null;

    /**
     * Determines whether atKey is public or not
     */
    isPublic: boolean = false;

    /**
     * Determines whether atKey is cached  
     */
    isCached: boolean = false;

    /**
     * Operation of llookup verb builder
     */
    operation?: string | null;

    buildCommand(): string {
        var command = 'llookup:';
        if (this.operation != null) {
            command += `${this.operation}:`;
        }
        if (this.isCached) {
            command += 'cached:';
        }
        if (this.isPublic) {
            command += 'public:';
        }
        if (this.sharedWith != null && this.sharedWith!.isNotEmpty()) {
            command += `${this.sharedWith}:`;
        }
        command += this.atKey!;
        return `${command}${VerbUtil.formatAtSign(this.sharedBy!)}\n`;
    }

    checkParams(): boolean {
        return this.atKey != null && this.atKey!.isNotEmpty() && this.sharedBy != null && this.sharedBy!.isNotEmpty();
    }
}
