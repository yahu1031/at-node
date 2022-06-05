import { VerbSyntax } from "@sign/at-commons";
import { From } from "./from";
import { Verb } from "./verb";

/**
* The "pol"(Proof of Life) verb is used to signal to the @alice secondary server to check for the cookie on the @bob secondary server.
* The “pol” verb allows to login as atsign B in the atsign A's server. To switch as another user, use from:<@sign>(The another @sign user) verb which gives a response as proof:; then use pol verb. On successful authentication, the prompt changes to the another @sign user. If we authenticate to other atsign using pol, we can only access public information available
* An invalid syntax closes the atsign client connection.
*
* Syntax: `pol`
*/

export class Pol extends Verb {
    name(): string {
        return 'pol';
    }

    syntax(): string | RegExp  {
        return VerbSyntax.pol;
    }

  dependsOn(): Verb | null {
        return new From();
    }

  usage():string {
        return 'syntax pol e.g pol';
    }

  requiresAuth(): boolean {
        return false;
    }
}
