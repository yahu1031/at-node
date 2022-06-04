export abstract class AtServer {
    /** 
     * Starts the  server. Calling this method on an already started server has no effect.
     * @throws [AtServerException] if the server cannot be started
     */
    abstract start(): void;

    /**
     * Stops the server. Calling this method on an already stopped server has no effect.
     * @throws [AtServerException] if the server cannot be stopped
     */
    abstract stop(): Promise<void>;

    /**
      * Returns status of the server
      * @return true is the server is running.
      */
    abstract isRunning(): boolean;

    /**
     * Pauses the server. In this state the server would have been fully initialized but it will not serve any request till the resume is
     * called.
     */
    abstract pause(): void;

    /**
     * Resumes the server. In this state the server will be able to serve the request.
     */
    abstract resume(): void;
}

/**
 * @beta
 * Class that holds server attributes
 */
export abstract class AtServerContext { }
