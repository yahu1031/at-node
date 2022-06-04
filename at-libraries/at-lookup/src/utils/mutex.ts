import { AtLogger } from "@sign/at-utils";

export class Mutex {
    private _isLocked = false;
    private _rwMutex = new ReadWriteMutex();

    public isLocked() {
        return this._isLocked;
    }

    public acquire() {
        return this._rwMutex.acquireWrite();
    }

    public release() {
        this._rwMutex.release();
    }

    public protect<T>(criticalSection: () => Promise<T>) {
        this.acquire().then(() => criticalSection().then(this.release, this.release));
    }
}

export class ReadWriteMutex {
    private _waiting: ReadWriteMutexRequest[] = [];

    private _logger = new AtLogger('ReadWriteMutex');

    private _state: number = 0; // -1 = write lock, +ve = number of read locks; 0 = no lock
    public isLocked() { return this._state != 0; }
    public isWriteLocked() { return this._state == -1; }
    public isReadLocked() { return 0 < this._state; }

    public acquireRead(): Promise<void> { return this._acquire(true); }

    public acquireWrite(): Promise<void> { return this._acquire(false); }

    public release() {
        if (this._state == -1) {
            // Write lock released
            this._state = 0;
        } else if (0 < this._state) {
            // Read lock released
            this._state--;
        } else if (this._state == 0) {
            throw this._logger.error('No lock to release');
        } else {
            throw Error('invalid state');
        }

        // Let all jobs that can now acquire a lock do so.

        while (this._waiting.length > 0) {
            const nextJob = this._waiting[0];
            if (this._jobAcquired(nextJob!)) {
                this._waiting.shift();
            } else {
                break; // no more can be acquired
            }
        }
    }

    public async protectRead<T>(criticalSection: () => T | Promise<T>): Promise<T | void> {
        await this.acquireRead();
        try {
            return criticalSection();
        } finally {
            return this.release();
        }
    }

    public async protectWrite<T>(criticalSection: () => T | Promise<T>): Promise<T | void> {
        await this.acquireWrite();
        try {
            return criticalSection();
        } finally {
            return this.release();
        }
    }

    private _acquire(isRead: boolean): Promise<void> {
        const newJob = new ReadWriteMutexRequest(isRead);
        if (!this._jobAcquired(newJob)) {
            this._waiting.push(newJob);
        }
        return newJob.completer.promise;
    }

    private _jobAcquired(job: ReadWriteMutexRequest) {
        if (!(-1 <= this._state)) {
            throw Error('invalid state');
        }
        if (this._state == 0 || (0 < this._state && job.isRead)) {
            // Can acquire
            this._state = (job.isRead) ? (this._state + 1) : -1;
            job.completer.onComplete();
            return true;
        } else {
            return false;
        }
    }
}

class ReadWriteMutexRequest {
    constructor(public isRead: boolean) { }

    public completer: Completer<void> = new Completer<void>();

}

class Completer<T> {
    public readonly promise: Promise<T>;
    public onComplete!: (value: (PromiseLike<T> | T)) => void;
    public onReject!: (reason?: any) => void;

    public constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.onComplete = resolve;
            this.onReject = reject;
        })
    }
}