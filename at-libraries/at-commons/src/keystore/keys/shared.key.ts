import { VerbUtil } from "../../utils";
import { AtKey } from "../at-key";
import { Metadata } from "../metadata";

export class SharedKey extends AtKey {
    constructor() {
        super();
        this.metadata = new Metadata();
    }

    toString(): string {
        this.sharedBy = VerbUtil.formatAtSign(this.sharedBy!)!;
        return `${this.sharedWith}:${this.key}.${this.namespace}${this.sharedBy}`;
    }
}
