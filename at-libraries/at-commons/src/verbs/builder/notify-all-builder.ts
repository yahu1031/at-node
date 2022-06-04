import { VerbUtil } from '../../utils';
import { VerbBuilder } from '.';
// import '../../utils/ext.util';
import { OperationEnum } from '../../utils';

export class NotifyAllVerbBuilder implements VerbBuilder {
    /**
     * Key that represents a user's information. e.g phone, location, email etc.,
     */
    atKey?: string | null;

    /**
     * Value of the key typically in string format. Images, files, etc.,
     * must be converted to unicode string before storing.
     */
    value: any;

    /** 
     * AtSign to whom[atKey] has to be shared.
     */
    sharedWithList?: string[] | null;

    /** 
     * AtSign of the client user calling this builder.
     */
    sharedBy?: string | null;

    /** 
     * If [isPublic] is true, then [atKey] is accessible by all atSigns.
     * if [isPublic] is false, then [atKey] is accessible either by [sharedWith] or [sharedBy]
     */
    isPublic: boolean = false;

    /** 
     * Time in milliseconds after which [atKey] expires.
     */
    ttl?: number | null;

    /** 
     * Time in milliseconds after which [atKey] becomes active.
     */
    ttb?: number | null;

    /** 
     * Time in milliseconds to refresh [atKey].
     */
    ttr?: number | null;

    operation?: OperationEnum | null;

    ccd?: boolean | null;

    buildCommand(): string {
        var command = 'notify:';

        if (this.operation != null) {
            command += `${this.operation}:`;
        }
        if (this.ttl != null) {
            command += `ttl:${this.ttl}:`;
        }
        if (this.ttb != null) {
            command += `ttb:${this.ttb}:`;
        }
        if (this.ttr != null) {
            this.ccd = this.ccd ?? false;
            command += `ttr:${this.ttr}:ccd:${this.ccd}:`;
        }
        if (this.sharedWithList != null && this.sharedWithList!.isNotEmpty()) {
            var sharedWith = this.sharedWithList!.join(',');
            command += `${VerbUtil.formatAtSign(sharedWith)}:`;
        }

        if (this.isPublic) {
            command += 'public:';
        }
        command += this.atKey!;

        if (this.sharedBy != null) {
            command += `${VerbUtil.formatAtSign(this.sharedBy!)}`;
        }

        if (this.value != null) {
            command += `:${this.value}`;
        }

        return `${command}\n`;
    }

    public checkParams(): boolean {
        return !((this.atKey && this.atKey == null) || (this.isPublic == true && this.sharedWithList && this.sharedWithList != null));
    }
}
