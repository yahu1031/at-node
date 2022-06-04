import { CachedKeyBuilder } from "./cached-key-builder";
import { PublicKey } from "./../keys";

/**
 * Builder class to build the public keys
 */
export class PublicKeyBuilder extends CachedKeyBuilder {
    constructor() {
        super();
        this._atKey = new PublicKey();
        this._metaData.isPublic = true;
        this._metaData.isHidden = false;
    }

    cache(ttr: number, ccd: boolean): void {
        this._metaData.ttr = ttr;
        this._metaData.ccd = ccd;
        this._metaData.isCached = (ttr != 0);
    }
}