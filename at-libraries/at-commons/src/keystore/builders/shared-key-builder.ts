import { CachedKeyBuilder } from "./cached-key-builder";
import { AtError } from "../../errors";
import { SharedKey } from "./../keys";

/**
 * Builder to build the shared keys
 */
export class SharedKeyBuilder extends CachedKeyBuilder {
    constructor() {
        super();
        this._atKey = new SharedKey();
        this._metaData.isPublic = false;
        this._metaData.isHidden = false;
    }

    cache(ttr: number, ccd: boolean): void {
        this._metaData.ttr = ttr;
        this._metaData.ccd = ccd;
        this._metaData.isCached = (ttr != 0);
    }

    /// Accepts a string which represents an atSign for the key is created.
    sharedWith(sharedWith: string): void {
        sharedWith = sharedWith.trim();
        this._atKey.sharedWith = sharedWith;
    }

    validate(): void {
        //Call AbstractKeyBuilder validate method to perform the common validations.
        super.validate();
        if (this._atKey.sharedWith == null || this._atKey.sharedWith!.isEmpty()) {
            throw new AtError('sharedWith cannot be empty', 'SharedKeyBuilder');
        }
    }
}