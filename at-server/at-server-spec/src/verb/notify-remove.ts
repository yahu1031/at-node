import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * The “notify:remove” verb deletes the notification from Notification keystore.
 * The @sign should be authenticated using the cram/pkam verb prior to use the notify verb.
 * A malformed request does not close the @sign client connection.
 *
 * Syntax: `notify:remove:<id>`
 */
export class NotifyRemove extends Verb {

    name(): string {
        return 'notify';
    }


    syntax(): string | RegExp {
        return VerbSyntax.notifyRemove;
    }


    dependsOn(): Verb | null {
        return null;
    }


    usage(): string {
        return 'e.g notify:remove:<notificationId>';
    }


    requiresAuth(): boolean {
        return true;
    }
}
