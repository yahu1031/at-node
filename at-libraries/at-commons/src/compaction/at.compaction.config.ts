/**
 * @beta
 */
class AtCompactionConfig {

    /**
     * -1 indicates storing for ever
     */
    sizeInKB: number = -1;

    /**
     * -1 indicates storing for ever
     */
    timeInDays: number = -1;

    /** 
     * Percentage of logs to compact when the condition is met
     */
    compactionPercentage?: number | null;

    /**
     * Frequency interval in which the logs are compacted
     */
    compactionFrequencyMins?: number | null;

    constructor(sizeInKB: number, timeInDays: number, compactionPercentage: number | null,
        compactionFrequencyMins: number | null) {
        this.sizeInKB = sizeInKB;
        this.timeInDays = timeInDays;
        this.compactionPercentage = compactionPercentage!;
        this.compactionFrequencyMins = compactionFrequencyMins!;
    }

    timeBasedCompaction(): boolean {
        return this.timeInDays != -1;
    }

    sizeBasedCompaction(): boolean {
        return this.sizeInKB != -1;
    }
}
