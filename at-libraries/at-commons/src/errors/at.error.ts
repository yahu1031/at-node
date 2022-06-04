import { errorCodes } from ".";

/**
 * AtError is the base class for all errors.
 */
export class AtError implements Error {
    /**
     * Name of the AtError
     */
    name!: string;
    /**
     * Message of the error
     */
    message!: string;
    /**
     * Cause/stacktraces of the error
     */
    cause?: Error;
    /**
     * Error code of error
     */
    errorCode?: string;

    constructor(message: string, stack?: string) {
        this.message = message;
        this.errorCode = errorCodes.get(this.constructor.name)!;
        this.name = this.constructor.name;
        this.cause = new Error(stack);
    }

    /**
     * Returns the error as a string.
     * 
     * EG:
     * ```text
     * AtServerError: AT0001 - There is some error in server.
     * ```
     */
    public toString = (): string => `${this.constructor.name}: ${errorCodes.get(this.constructor.name) ?? ''} - ${this.message}`;
}

/**
 * AtClientError is the base class for all client errors.
 */
class AtClientError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * AtEncryptionError is the base class for all encryption errors.
 */
class AtEncryptionError extends AtClientError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This will occur when something went
 * wrong on an user tries to connect to the secondary.
 */
export class AtConnectionError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when trying to perform a read/write on a connection which is invalid.
 */
export class ConnectionInvalidError extends AtConnectionError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when trying to perform a read / write on an outbound connection which is invalid
 */ 
export class OutBoundConnectionInvalidError extends AtConnectionError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Error thrown when security certification validation on root or secondary server fails
 */ 
export class AtCertificateValidationError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Error thrown when there is any issue related to socket operations e.g read / write
 */ 
export class AtIOError extends AtError {
    constructor(message: string) {
        super(message);
    }
}


/**
 * This error occurs during keystore operations (GET/PUT/DELETE).
 */
export class DataStoreError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error occurs if we give any invalid command to the server.
 */
export class InvalidSyntaxError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error occurs when socket connection to secondary cannot be established.
 */
export class SocketError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error occurs when input/output 
 * message size reaches the maximum limit configured in the server.
 */
export class BufferOverFlowError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * error occurs when a secondary tries to connect to 
 * another secondary which is not available in the root directory or not yet instantiated.
 */
export class SecondaryNotFoundError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error is for any error during the handshake process of two secondaries.
 */
export class HandShakeError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * UnAuthorized error will occur when an 
 * unsuccessful handshake happens between two secondaries.
 */
export class UnAuthorizedError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error will occur when we are unable to connect to secondary.
 */
export class SecondaryConnectError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error will occur when we there is unexpected argument passed.
 */
export class IllegalArgumentError extends AtError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error will occur when we are unable to connect to secondary with in the time.
 */
export class AtTimeoutError extends AtError {
    constructor(message: string) {
        super(message);
    }
}


/**
 * This error will occur when we are trying to run a command on a secondary without authentication.
 */
export class UnAuthenticatedError extends AtError {
    constructor(message: string) {
        super(message);
    }
}


export class AtKeyError extends AtClientError {
    constructor(message: string) {
        super(message);
    }
}

export class AtValueError extends AtClientError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error will be thrown when there is a change in the public key.
 */
export class AtPublicKeyChangeError extends AtEncryptionError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error will be thrown when the key is not available for encryption/decryption.
 */
export class AtPublicKeyNotFoundError extends AtEncryptionError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * This error will be thrown if there is issue while decrypting the data.
 */
export class AtDecryptionError extends AtClientError {
    constructor(message: string) {
        super(message);
    }
}
