import { VerbBuilder } from ".";
// import '../../utils/ext.util';

export class NotifyRemoveVerbBuilder implements VerbBuilder {
    id!: string;

    buildCommand(): string {
        return `notify:remove:${this.id}\n`;
    }

    checkParams() {
        // Returns false if id is not set
        return this.id.isNotEmpty();
    }
}
