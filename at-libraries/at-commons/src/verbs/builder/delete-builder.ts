// import '../../utils/ext.util';
import { AT_KEY, VerbSyntax, VerbUtil } from "../../utils";
import { VerbBuilder } from '.';


/** Delete verb builder generates a command to delete a [atKey] from the secondary server.
 * ```ts
 * // @bob deleting a public phone key
 * var deleteBuilder = new DeleteVerbBuilder();
 * deleteBuilder.key = 'public:phone@bob';
 * 
 * // @bob deleting the key “phone” shared with @alice
 * var deleteBuilder = new DeleteVerbBuilder();
 * deleteBuilder.key = '@alice:phone@bob';
 * ```
 */
export class DeleteVerbBuilder implements VerbBuilder {
    /**
     * The key to delete
     */
    atKey?: string | null;

    /**
     * atSign of the secondary server on which llookup has to be executed.
     */
    sharedBy?: string | null;

    /**
     * atSign of the secondary server for whom [atKey] is shared
     */
    sharedWith?: string | null;

    isPublic: boolean = false;

    isCached: boolean = false;

    public buildCommand(): string {
        var command = 'delete:';

        if (this.isCached) {
            command += 'cached:';
        }

        if (this.isPublic) {
            command += 'public:';
        }

        if (this.sharedWith != null && this.sharedWith!.isNotEmpty()) {
            command += `${VerbUtil.formatAtSign(this.sharedWith)}:`;
        }
        if (this.sharedBy != null && this.sharedBy!.isNotEmpty()) {
            command += `${this.atKey}${VerbUtil.formatAtSign(this.sharedBy)}`;
        } else {
            command += this.atKey!;
        }
        command += '\n';
        return command;
    }

    /**
     * 
     * Returns a builder instance from a delete command
     */
    public getBuilder(command: string): DeleteVerbBuilder {
        var builder = new DeleteVerbBuilder();
        var verbParams = VerbUtil.getVerbParam(VerbSyntax.delete, command)!;
        builder.atKey = verbParams.get(AT_KEY)!;
        return builder;
    }

    public checkParams(): boolean {
        return this.atKey != null;
    }
}
