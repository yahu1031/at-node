import { VerbBuilder } from ".";

export class NotifyStatusVerbBuilder implements VerbBuilder {
    /**
     * Notification Id to query the status of notification
     */
    notificationId?: string | null;

    buildCommand(): string {
        var command = 'notify:status:';
        if (this.notificationId != null) {
            command += `${this.notificationId}\n`;
        }
        return command;
    }

    checkParams(): boolean {
        return this.notificationId !== null;
    }
}
