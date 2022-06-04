import { InboundConnection } from "../connection/inbound-connection";

export abstract class VerbHandler {
    /** 
     * Returns true if a verb handler can accept this command.
     * @param command - at protocol command
     * @returns bool
     */
    abstract accept(command: string): boolean;

    /** 
     * Processes a given command from a inboundConnection
     * @param command - at protocol command
     * @param inboundConnection - requesting[InboundConnection]
     */
    abstract process(command: string, inboundConnection: InboundConnection): Promise<void>;
}

export abstract class VerbHandlerManager {
    /**
    * Returns the verb handler for a given command
    * @param utf8 encoded command
    * @returns [VerbHandler]
    */
    abstract getVerbHandler(utf8EncodedCommand: string): VerbHandler | null;
}

export abstract class VerbExecutor {
    /**
    * Runs a command requested by from connection using a verb manager
    * @params utf8EncodedCommand - command to execute
    * @params fromConnection - requesting [InboundConnection]
    * @params verbManager - [VerbHandlerManager]
    */
    abstract execute(utf8EncodedCommand: string,
        fromConnection: InboundConnection, verbManager: VerbHandlerManager): Promise<void>;
}
