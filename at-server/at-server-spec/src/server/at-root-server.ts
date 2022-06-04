
import { Socket } from "node:net"
import { AtServer, AtServerContext } from "./at-server"

/** 
 * Represents the root server of the @protocol.
 * Contains methods to start, stop and server the requests.
 */
export abstract class AtRootServer extends AtServer {
  /**
   * Sets the server context
   * @param context - context for this server to start
   */
  abstract setServerContext(context: AtServerContext): void;
}

/**
 * Represent an incoming request
 */
export abstract class AtClientConnection {
  /**
   * Returns the socket on which the connection has been made.
   */
  abstract getSocket(): Socket;
}

/**
 * Represent the security context which is used by the server on start up.
 */
export abstract class AtSecurityContext {
  /** 
   *  Returns path of the public key file.
   */
  abstract publicKeyPath(): string;

  /** 
   *  Returns path of the private key file.
   */
  abstract privateKeyPath(): string;

  /** 
   * Returns path of trusted certificate file.
   */
  abstract trustedCertificatePath(): string;

  /** 
   *  Returns path of the bundle.
   */
  abstract bundle(): string;
}
