import { SecondaryAddress } from "./secondary-finder";

export class SecondaryAddressCacheEntry {
    secondaryAddress!: SecondaryAddress;

    /**
     * milliseconds since epoch
     */
    expiresAt!: number;

    constructor(secondaryAddress: SecondaryAddress, expiresAt: number) {
        this.secondaryAddress = secondaryAddress;
        this.expiresAt = expiresAt;
    }

}