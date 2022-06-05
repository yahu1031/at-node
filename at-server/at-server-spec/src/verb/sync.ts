import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/**
 * The "sync" verb is used to fetch all the keys after a given commit sequence number from the commit log on the server
 * Optionally pass a regex to fetch only keys that match the regex
 * 
 * Syntax: `sync:<from_commit_seq>:<regex>`
 * 
 * e.g. sync: 10
 * 
 * `sync:10:.wavi`
 */
export class Sync extends Verb {

    name(): string {
        return 'sync';
    }


    syntax(): string | RegExp {
        return VerbSyntax.sync;
    }


  dependsOn(): Verb | null {
        return null;
    }


  usage(): string {
        return 'syntax sync:@<from_commit_seq> \n e.g sync:10';
    }


  requiresAuth(): boolean {
        return true;
    }
}
