import { VerbSyntax } from "@sign/at-commons";
import { From } from './from';

/** 
 * The pkam( Public Key Authentication Mechanism) verb is used to authenticate the @sign to the secondary server. This is similar to how ssh authentication works. On successful request, binds the @sign to the secondary server.
 * On successful pkam verb request, the @sign is successfully authenticated to the secondary server and allows user to Add/Update, Delete and lookup the keys in their respective secondary servers.
 *
 * Syntax: `pkam:<signature>`
 */
export class Pkam extends Verb {
    name(): string {
        return 'pkam';
    }

    syntax(): string | RegExp {
        return VerbSyntax.pkam;
    }

    dependsOn(): Verb | null {
        return new From();
    }

    usage(): string {
        return 'pkam:<signature>';
    }

    requiresAuth() {
        return false;
    }
}
