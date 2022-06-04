import { Metadata } from ".";

/**
 * AtValue is the value of the AtKey.
 */
export class AtValue{
    /**
     * Value of the key. 
     * This can be a string, number, boolean, or any other type.
     */
    value: any;
    /**
     * Metadata of AtValue.
     */
    metadata?: Metadata;
}