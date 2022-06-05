import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * The "llookup" verb can be used to locally lookup keys stored on the secondary server. To perform local look up, the user should be successfully authenticated using cram/pkam verb.
 * A malformed request closes the @sign client connection.
 * Syntax: llookup:<key to lookup>
 * e.g.
 * llookup:public:phone@alice - returns alice's public phone number
 * llookup:@bob:phone@alice - returns alice's phone number shared with bob
 * llookup:@alice:phone@alice - returns alice's private phone number
 * llookup:meta:public:location@bob - returns the metadata of the location key
 * llookup:all:public:location@bob - returns all the details including the metadata and value of the key
 */
export class LocalLookup extends Verb {
    name(): string {
        return 'llookup';
    }

    syntax(): string | RegExp {
        return VerbSyntax.llookup;
    }

    dependsOn(): Verb | null {
        return null;
    }

    usage(): string {
        return 'e.g llookup:location@bob';
    }

    requiresAuth(): boolean {
        return true;
    }
}
