/**
 * VerbBuilder is used to build `@protocol` command that can be executed by a secondary server.
 */
export abstract class VerbBuilder {
    /**
     * Build the `@command` to be sent to remote secondary for execution.
     */
    public abstract buildCommand(): string;

    /**
     * Checks whether all params required by the verb builder are set. Returns false if
     * required params are not set.
     */
    public abstract checkParams(): boolean;
}
