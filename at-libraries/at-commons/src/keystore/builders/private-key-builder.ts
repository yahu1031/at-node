import { PrivateKey } from "./../keys";
import { AtKeyBuilder } from "./key.builder";


/**
 * Builder to build the hidden keys
 */
export class PrivateKeyBuilder extends AtKeyBuilder {
    constructor() {
        super();
        this._atKey = new PrivateKey();
        this._metaData.isHidden = true;
        this._metaData.isPublic = false;
    }
}