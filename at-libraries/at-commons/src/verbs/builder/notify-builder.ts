import * as Uuid from 'uuid';
import { VerbBuilder } from '.';
import { OperationEnum, PriorityEnum, StrategyEnum, MessageTypeEnum, SYSTEM, SHARED_KEY_ENCRYPTED, SHARED_WITH_PUBLIC_KEY_CHECK_SUM, VerbUtil } from '../../utils/';

export class NotifyVerbBuilder implements VerbBuilder {
    /**
     * ID for each notification.
     */
    id: string = Uuid.v4();

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
     * AtSign to whom [atKey] has to be shared.
     */
    sharedWith?: string | null;

    /**
     * AtSign of the client user calling this builder.
     */
    sharedBy?: string | null;

    /**
     * If [isPublic] is true, then [atKey] is accessible by all atSigns.
     * If [isPublic] is false, then [atKey] is accessible either by [sharedWith] or [sharedBy]
     */
    isPublic = false;

    /**
     * Time in milliseconds after which [atKey] expires.
     */
    ttl?: number | null;

    /**
     * Time in milliseconds after which a notification expires.
     */
    ttln?: number | null;

    /**
     * Time in milliseconds after which [atKey] becomes active.
     */
    ttb?: number | null;

    /**
     * Time in milliseconds to refresh [atKey].
     */
    ttr?: number | null;

    operation?: OperationEnum | null;

    /**
     * Priority of the notification
     */
    priority?: PriorityEnum | null;

    /**
     * Strategy in processing the notification
     */
    strategy?: StrategyEnum | null;

    /**
     * Type of notification
     */
    messageType?: MessageTypeEnum | null;

    /**
     * The notifier of the notification. Defaults to system.
     */
    notifier: string = SYSTEM;

    /**
     * Latest N notifications to notify. Defaults to 1
     */
    latestN?: number | null;

    ccd?: boolean | null;

    /**
     * Will be set only when [sharedWith] is set. Will be encrypted using the public key of [sharedWith] atsign
     */
    sharedKeyEncrypted?: string | null;

    /**
     * Checksum of the the public key of [sharedWith] atsign. Will be set only when [sharedWith] is set.
     */
    pubKeyChecksum?: string | null;

    public buildCommand(): string {
        var command = 'notify:id:$id:';

        if (this.operation != null) {
            command += `${this.operation}:`;
        }
        if (this.messageType != null) {
            command += `messageType:${this.messageType}:`;
        }
        if (this.priority != null) {
            command += `priority:${this.priority}:`;
        }
        if (this.strategy != null) {
            command += `strategy:${this.strategy}:`;
        }
        if (this.latestN != null) {
            command += `latestN:${this.latestN}:`;
        }
        command += `notifier:${this.notifier}:`;
        if (this.ttl != null) {
            command += `ttl:${this.ttl}:`;
        }
        if (this.ttln != null) {
            command += `ttln:${this.ttln}:`;
        }
        if (this.ttb != null) {
            command += `ttb:${this.ttb}:`;
        }
        if (this.ttr != null) {
            this.ccd = this.ccd ?? false;
            command += `ttr:${this.ttr}:ccd:${this.ccd}:`;
        }

        if (this.sharedKeyEncrypted != null) {
            command += `${SHARED_KEY_ENCRYPTED}:${this.sharedKeyEncrypted}:`;
        }
        if (this.pubKeyChecksum != null) {
            command += `${SHARED_WITH_PUBLIC_KEY_CHECK_SUM}:${this.pubKeyChecksum}:`;
        }

        if (this.sharedWith != null) {
            command += `${VerbUtil.formatAtSign(this.sharedWith)}:`;
        }

        if (this.isPublic) {
            command += 'public:';
        }
        command += this.atKey!;

        if (this.sharedBy != null) {
            command += `${VerbUtil.formatAtSign(this.sharedBy)}`;
        }
        if (this.value != null) {
            command += `:${this.value}`;
        }

        return `${command}\n`;
    }

    checkParams(): boolean {
        return !((this.atKey == null) || (this.isPublic == true && this.sharedWith != null));
    }
}
