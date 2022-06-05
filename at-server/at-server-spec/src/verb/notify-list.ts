import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * The “notify:list” verb displays all the notifications received by the @sign .
 * The @sign should be authenticated using the cram/pkam verb prior to use the notify verb.
 * A malformed request does not close the @sign client connection.
 *
 * Syntax: `notify:list` - list all the notifications
 * 
 * `notify:list:<regex>` - list notifications matched with the regex
 * 
 * To List notification between two dates and matches with the regex
 * 
 * `notify:list:<StartDate>:<EndDate>:<regex>`
 * 
 * regex, startDate, endDate are optional
 */
export class NotifyList extends Verb {

    name(): string {
        return 'notify';
    }


    syntax(): string | RegExp {
        return VerbSyntax.notifyList;
    }


    dependsOn(): Verb | null {
        return null;
    }


    usage(): string {
        return 'e.g notify:list [regular expression]';
    }


    requiresAuth(): boolean {
        return false;
    }
}
