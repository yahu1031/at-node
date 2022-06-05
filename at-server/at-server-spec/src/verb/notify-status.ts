import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * The “notify:status” is used to get the notification status using notificationId
 * The notification status can be either delivered, errored, queued or expired.
 * The @sign should be authenticated using the cram/pkam verb prior to use the notify:status verb.
 * A malformed request does not close the @sign client connection.
 *
 * Syntax: `notify:status:<notification-id>`
 */
export class NotifyStatus extends Verb {
    name(): string {
        return 'notify';
    }

    syntax(): string | RegExp {
        return VerbSyntax.notifyStatus;
    }

    dependsOn(): Verb | null {
        return null;
    }

    usage(): string {
        return 'e.g notify:status:<notification-id>';
    }

    requiresAuth(): boolean {
        return false;
    }
}
