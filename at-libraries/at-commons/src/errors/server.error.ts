import { AtError } from ".";

/**
 * Exception occurs when there is an issue while starting the server.
 */
export class AtServerError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This exception will occur when the number of active clients reaches the maximum limit configured.
 */
export class InboundConnectionLimitError extends AtServerError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Exception occurs when the number of open connections to other secondaries reaches the maximum limit configured.
 */
export class OutboundConnectionLimitError extends AtServerError {
    constructor(message: string) {
        super(message)
    };
}

/**
 * This will occur when a blocked user tries to connect to the secondary.
 */
export class BlockedConnectionError extends AtServerError {
    constructor(message: string) {
        super(message)
    };
}

/** 
 * Thrown when lookup fails after handshake
 */
export class LookupError extends AtServerError {
    constructor(message: string) {
        super(message)
    };
}

/**
 * Thrown for any unhandled server Error
 */
export class InternalServerError extends AtServerError {
    constructor(message: string) {
        super(message)
    };
}

/**
 * This exception is used for any server related exceptions.
 */
export class InternalServerException extends AtServerError {
    constructor(message: string) {
        super(message)
    };
}
