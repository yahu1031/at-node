
import { VerbExecutor, VerbHandlerManager } from "../verb/verb-manager";
import { AtServer, AtServerContext } from "./at-server";

/** 
 * Represents the secondary server of the @protocol.
 * Contains methods to start, stop and server the requests.
 */
export abstract class AtSecondaryServer extends AtServer {
    /** 
     * Sets the executor for the requests to the server
     */
    abstract setExecutor(executor: VerbExecutor): void;

    /**
     *  Sets Verb handler to be used by the server
     */
    abstract setVerbHandlerManager(handlerManager: VerbHandlerManager): void;

    /**
     * Returns various connection metrics
     */
    abstract getMetrics(): ConnectionMetrics;

    /** 
     * Sets the server context
     * @param context - context for this server to start
     */
    abstract setServerContext(context: AtServerContext): void;
}

/**
 * Access point to the statistics of an [AtConnection]
 */
export abstract class ConnectionMetrics {
    /**
     * Returns the number of active connections
     * 0 if not available.
     */
    abstract getInboundConnections(): number;

    /**
      * Returns the number of active connections made by the current secondary to another secondary server
      * 0 if not available.
      */
    abstract getOutboundConnections(): number;
}
