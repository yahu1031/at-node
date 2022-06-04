import { AtLogger } from "@sign/at-utils";

/**
 * IQueue
 * @template T 
 */
interface IQueue<T> {
    enqueue(item: T): void;
    dequeue(): T | undefined;
    size(): number;
}

/**
 * Queue
 * @template T 
 */
export class Queue<T> implements IQueue<T> {
    _logger = new AtLogger('Queue');
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) { }

    /**
     * Enqueues queue
     * @param item 
     */
    enqueue(item: T): void {
        if (this.size() === this.capacity) {
            this._logger.error('Queue has reached max capacity, you cannot add more items');
            throw Error('Queue has reached max capacity, you cannot add more items');
        }
        this.storage.push(item);
    }

    /**
     * Dequeues queue
     * @returns {T} 
     * @throws Error if queue is empty
     */
    dequeue(): T | undefined {
        if (this.size() <= 0) {
            this._logger.error('Queue is empty, you cannot remove item');
            throw Error('Queue is empty, you cannot remove item');
        }
        return this.storage.shift();
    }

    /**
     * Dequeues last
     * @returns last
     * @throws Error if queue is empty 
     */
    dequeueLast(): T {
        let lastElement: T = this.storage[this.storage.length - 1]!;
        if (this.size() > 0) {
            this.storage.splice(this.storage.length - 1, this.storage.length);
            return lastElement;
        }
        this._logger.error('Queue is empty, you cannot remove last item');
        throw Error('Queue is empty, you cannot remove last item');
    }

    /**
     * Dequeues first
     * @returns first
     * @throws Error if queue is empty 
     */
    dequeueFirst(): T {
        let firstElement: T = this.storage[0]!;
        if (this.size() > 0) {
            this.storage.splice(0, 1);
            return firstElement;
        }
        this._logger.error('Queue is empty, you cannot remove last item');
        throw Error('Queue is empty, you cannot remove last item');
    }

    /**
     * Enqueues first
     * @param item 
     * @throws Error if queue is full
     */
    enqueueFirst(item: T): void {
        if (this.size() === this.capacity) {
            this._logger.error('Queue has reached max capacity, you cannot add more items');
            throw Error('Queue has reached max capacity, you cannot add more items');
        }
        this.storage.unshift(item);
    }

    /**
     * Enqueues all
     * @param items
     * @throws Error if queue is full 
     */
    enqueueAll(items: T[]): void {
        if (this.size() + items.length > this.capacity) {
            this._logger.error('Queue has reached max capacity, you cannot add more items');
            throw Error('Queue has reached max capacity, you cannot add more items');
        }
        this.storage = items.concat(this.storage);
    }

    /**
     * Dequeues where
     * @param predicate 
     */
    dequeueWhere(predicate: (item: T) => boolean): void {
        this.storage = this.storage.filter(item => !predicate(item));
    }

    /**
     * Retains where
     * @param predicate 
     */
    retainWhere(predicate: (item: T) => boolean): void {
        this.storage = this.storage.filter(item => predicate(item));
    }

    /**
     * Sizes queue
     * @returns size 
     */
    size(): number {
        return this.storage.length;
    }
}