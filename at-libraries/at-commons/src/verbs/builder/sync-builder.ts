import { VerbBuilder } from ".";
// import '../../utils/ext.util';

export class SyncVerbBuilder implements VerbBuilder {

    /**
     * Commit id of the current sync.
     */
    public commitID!: string;

    /**
     * Regex for sync.
     */
    public regex?: RegExp | string | null;

    /**
     * Limit for the no.of commits to be synced at a time.
     */
    public limit: number = 10;

    /**
     * isPaginated is true if there is any specific pagination required.
     */
    public isPaginated: boolean = false;

    public buildCommand(): string {
        var command = 'sync:';
        if (this.isPaginated) {
            command += 'form:';
        }
        command += `${this.commitID}`;
        if (this.isPaginated) {
            command += `:limit:${this.limit}`;
        }
        if (this.regex !== null && this.regex && this.regex.toString().isNotEmpty()) {
            command += `:${this.regex}`;
        }
        command += '\n';
        return command;
    }

    public checkParams(): boolean {
        return true;
    }

}