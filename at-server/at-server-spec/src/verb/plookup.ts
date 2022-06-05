import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/**
 * The "plookup" verb, provides a proxied public lookups for a resolver that perhaps is behind a firewall. This will allow a resolver to contact a @ server and have the @ server lookup both public @sign's information.
 * This will be useful in large enterprise environments where they would want all lookups going through a single secondary server for the entity or where a single port needs to be opened through a firewall to lookup @signs.
 * The @sign should be authenticated prior to using the plookup verb.
 * A malformed request closes the @sign client connection.
 *
 * Syntax : plookup:<key to lookup>
 * e.g @bob:plookup:phone@alice - returns public value of alice's phone
 * Example: plookup:all:country@alice - returns all the details including key, value including the metadata
 * plookup:meta:country@alice - returns only metadata of the key
 */
export class ProxyLookup extends Verb {
    name(): string {
        return 'plookup';
    }

    syntax(): string | RegExp {
        return VerbSyntax.plookup;
    }

    dependsOn(): Verb | null {
        return null;
    }

    usage(): string {
        return 'e.g plookup:location@bob';
    }

    requiresAuth(): boolean {
        return true;
    }
}
