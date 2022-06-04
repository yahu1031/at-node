/**
 * Represents a Verb in the @sign protocol.
 */
abstract class Verb {
    /** 
     * Returns name of the verb
     */
    abstract name(): string;

    /** 
     * Returns syntax of the verb in a regular expression format
     */
    abstract syntax(): string | RegExp;

    /** 
     * Returns a sample usage of the Verb
     */
    abstract usage(): string;

    /** 
     * Returns name of the Verb this verb depends on
     */
    abstract dependsOn(): Verb | null;

    /** 
     * Returns whether a verb requires authentication
     */
    abstract requiresAuth(): boolean;
}
