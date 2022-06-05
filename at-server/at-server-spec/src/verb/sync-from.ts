import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/**
 * The "sync" verb is used to fetch all the keys after a given commit sequence number from the commit log on the server
 * Optionally pass a regex to fetch only keys that match the regex
 * 
 * Syntax: `sync:from:<from_commit_seq>:limit:<10>:<regex>`
 * 
 * e.g. `sync:from:10:limit:10:.wavi`
 * 
 * `sync:10:.wavi`
 */
export class SyncFrom extends Verb {

    name(): string {
        return 'sync:from';
    }

    syntax(): string | RegExp {
        return VerbSyntax.syncFrom;
    }

    dependsOn(): Verb | null {
        return null;
    }

    usage(): string {
        return 'syntax sync:from:1:limit:10:.wavi';
    }

    requiresAuth(): boolean {
        return true;
    }
}
