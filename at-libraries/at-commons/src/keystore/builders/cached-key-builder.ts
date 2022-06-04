import { AtKeyBuilder } from "./key.builder";

/**
 * Abstract class for AtKey builder to build cached keys
 */
export abstract class CachedKeyBuilder extends AtKeyBuilder {
    constructor() {
        super();
    }

    /**
     * Will set the ttr and ccd for the key.
     * @param ttr 
     * @param ccd 
     */
    abstract cache(ttr: number, ccd: boolean): void;
}
