import { ConnectionInvalidError, StringBuffer } from "@sign/at-commons";
import { Socket } from "node:net";
import { AAtConnection, AtConnectionMetaData } from "./at.connection";

export abstract class ABaseConnection extends AAtConnection {
    private _socket: Socket;
    buffer: StringBuffer;
    metaData?: AtConnectionMetaData;

    constructor(socket: Socket) {
        super();
        this._socket = socket;
        this.buffer = new StringBuffer();
    }

    public getMetaData(): AtConnectionMetaData {
        return this.metaData!;
    }

    public async close(): Promise<void> {
        try {
            this._socket.destroy();
            this.getMetaData().isClosed = true;
        } catch (e) {
            this.getMetaData().isStale = true;
        }
    }

    public getSocket(): Socket {
        return this._socket;
    }

    public write(data: string): void {
        if (this.isInValid()) {
            //# Replace with specific exception
            throw new ConnectionInvalidError('Connection is invalid');
        }
        try {
            this.getSocket().write(data);
            this.getMetaData().lastAccessed = new Date(new Date().toUTCString());
        } catch (e) {
            this.getMetaData().isStale = true;
        }
    }
}

