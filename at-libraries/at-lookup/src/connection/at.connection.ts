import { Socket } from "node:net";

export abstract class AAtConnection {

    abstract write(data: string): void;

    abstract getSocket(): Socket;

    abstract close(): Promise<void>;

    abstract isInValid(): boolean;

    abstract getMetaData(): AtConnectionMetaData;
}

export class AtConnectionMetaData {
    lastAccessed?: Date | null;
    created?: Date | null;
    isClosed: boolean;
    isStale: boolean;
    constructor() {
        this.isClosed = false;
        this.isStale = false;
    }
}