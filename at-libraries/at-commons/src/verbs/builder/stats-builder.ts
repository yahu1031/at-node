import { VerbBuilder } from ".";

/** 
 * Stats builder generates a command that returns various of the server statistics of current atSign.
 * ```ts
 * // specific stats
 * var builder = new StatsVerbBuilder();
 * builder.ids = '3,4';
 *  ```
 */
export class StatsVerbBuilder implements VerbBuilder {
    /** 
     * Comma separated stat ids.
     * If no ids are supplied returns all the stats.
     * 1. Inbound Connection statistics
     * 2. Outbound Connection statistics
     * 3. Sync statistics
     * 4. Storage statistics
     * 5. Most visited atSign statistics
     * 6. Most read keys statistics
     */
    statIds?: string | null;

    /**
     *  Regular expression to filter keys.
     */
    regex?: RegExp | string | null;

    buildCommand(): string {
        var statsCommand = 'stats';
        if (this.statIds != null) {
            statsCommand += `:${this.statIds}`;
            if (this.regex != null) {
                statsCommand += `:${this.regex}`;
            }
        }
        statsCommand += '\n';
        return statsCommand;
    }

    checkParams(): boolean {
        /** 
         * TODO check ids contain only number
         */
        return true;
    }
}
