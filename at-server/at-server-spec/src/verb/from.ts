import { VerbSyntax } from "@sign/at-commons";

/** 
 * The “from” verb is used to tell the secondary server what @sign you claim to be, and the secondary server will respond with a challenge.
 * The challenge will be in the form of a full @ address and a cookie to place at that address. Before giving the challenge it will verify the client SSL certificate.
 * The client SSL certificate has to match the FQDN list in the root server for that @sign in either the CN or SAN fields in the certificate
 *
 * Syntax: `from:<@sign>`
 */
export class From extends Verb {

    name(): string {
        return 'from';
    }


    syntax(): string | RegExp {
        return VerbSyntax.from;
    }


    dependsOn(): Verb | null {
        return null;
    }


    usage(): string {
        return 'syntax from:@<atSign> \n e.g from:@alice';
    }


    requiresAuth(): boolean {
        return false;
    }
}
