import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * Delete verb deletes a key from @sign's secondary server.
 * The @sign should be authenticated using the cram/pkam verb prior using the delete verb.
 * A malformed request closes the @sign client connection.
 * A delete request must contain the distinguished name of the key to be deleted.
 *
 * Syntax : delete:<key to be deleted>
 * e.g.
 * @alice@delete:public:phone@alice - delete alice's public phone number
 */
export class Delete extends Verb {
    name(): string {
        return 'delete';
    }

    syntax(): string | RegExp {
        return VerbSyntax.delete;
    }

    dependsOn(): Verb | null {
        return null;
    }

    usage(): string {
        return 'syntax delete:@<atkey> \n e.g delete:phone@alice';
    }

    requiresAuth(): boolean {
        return true;
    }
}