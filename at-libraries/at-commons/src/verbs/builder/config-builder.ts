import { VerbUtil } from "../../utils";
import { VerbBuilder } from ".";
// import '../../utils/ext.util';

/** 
 * This builder generates a command to configure block list entries in the secondary server.
 * If an @sign is added to the block list then connections to the secondary will not be accepted.
 * ```ts
 * // e.g to block alice from accessing bob's keys
 * var builder = new ConfigVerbBuilder();
 * builder.block = '@alice';
 * ```
 */
export class ConfigVerbBuilder implements VerbBuilder {

    public configType!: string | null;

    public operation!: string | null;

    public atSigns!: string[] | null;

    public buildCommand(): string {
        var command = 'config:';
        command += `${this.configType}:`;
        if (this.operation === 'show') {
            command += this.operation;
        } else {
            command += `${this.operation}:`;
        }
        if (this.atSigns !== null && this.atSigns && this.atSigns.isNotEmpty()) {
            for (var atSign of this.atSigns!) {
                command += `${VerbUtil.formatAtSign(atSign)}`;
            }
        }
        command = command.trim();
        command = command + '\n';
        return command;
    }
    public checkParams(): boolean {
        // TODO: Implement checkParams
        return true;
    }

}
