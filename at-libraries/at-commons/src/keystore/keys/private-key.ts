import { AtKey } from "../at-key";
import { Metadata } from "../metadata";

/**
 * Represents a Private key.
 */
export class PrivateKey extends AtKey {
    constructor() {
        super();
        this.metadata = new Metadata();
    }

    toString(): string {
        return `privatekey:${this.key}`;
    }
}