import { Socket } from "node:net";
import { AtConnection } from "./at-connection";

export abstract class InboundConnection extends AtConnection {
    /**
     * Returns true if remote socket and remote port of this and connection matches
     */
    abstract equals(connection: InboundConnection): boolean;

    abstract isMonitor: boolean | null;

    /**
     * This contains the value of the atsign initiated the connection
     */
    abstract initiatedBy: string | null;

    abstract acceptRequests(callback: (data: string, connection: InboundConnection) => void,
        streamCallback: (data: number[], connection: InboundConnection) => void): void;

    abstract receiverSocket: Socket | null;
}
