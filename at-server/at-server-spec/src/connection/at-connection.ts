import { Socket } from "node:net";

export abstract class AtConnection {
    /**
     * Write a data to the underlying socket of the connection
     * @param - data - Data to write to the socket
     * @throws [AtIOException] for any exception during the operation
     */
    abstract write(data: string): void;

    /**
     * Retrieves the socket of underlying connection
     */
    abstract getSocket(): Socket;

    /**
     * Gets the connection metadata
     */
    abstract getMetaData(): AtConnectionMetaData;

    /**
     * closes the underlying connection
     */
    abstract close(): Promise<void>;

    /** 
     * Returns true if connection is closed or idle for configured time
     */
    abstract isInValid(): boolean;
}

export abstract class AtConnectionMetaData {
    sessionID?: string | null;
    lastAccessed?: Date | null;
    created?: Date | null;
    isClosed: boolean = false;
    isCreated: boolean = false;
    isStale: boolean = false;
    isListening: boolean = false;
    isAuthenticated: boolean = false;
    isPolAuthenticated: boolean = false;
    isStream: boolean = false;
    streamId?: string | null;
}
