/** 
 * Class holder for message of different data types(int, String etc.,)
 */
export abstract class AAtBuffer<T> {
    /**
     *  Message that is stored in the buffer
     */
    public message: T | undefined;

    /**
     * Maximum data the buffer can hold. If length() of the buffer exceeds this value,
     * AtBufferOverFlowError will be thrown on calling append(data)
     */
    public capacity!: number;

    /**
     * Define terminatingChar to indicate end of buffer
     */
    public terminatingChar!: string | number;

    /**
     * Returns the message stored in the buffer
     * @returns message stored
     */
    public abstract getData(): T | undefined;

    /**
     * True - is current capacity is greater than or equal to defined capacity. False - otherwise
     * @returns - boolean value indicating whether buffer is full or not.
     */
    public abstract isFull(): boolean;

    /**
     * True - if message ends with terminatingChar. False - otherwise.
     * @returns - boolean value indicating end of buffer
     */
    public abstract isEnd(): boolean;

    /**
     * Clear the message stored in the buffer
     * @returns - void
     */
    public abstract clear(): void;

    /**
     * Calculate current length of the message store in the buffer
     * @returns - length of the buffer
     */
    public abstract length(): number;

    /**
     * Appends data to currently stored message to buffer.
     * @returns void
     * @throws AtBufferOverFlowError if length() + data.length > capacity
     */
    public abstract append(data: T): void;
}