import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * The "noop" verb takes a single parameter, a duration in milliseconds.
 *
 * NoOp simply does nothing for the requested number of milliseconds.
 * The requested number of milliseconds may not be greater than 5000.
 * Upon completion, the noop verb sends 'OK' as a response to the client.
 *
 * This verb _does not_ require authentication.
 *
 * **Syntax**: `noop:<durationInMillis>`
 */
export class NoOp extends Verb {
    name(): string {
        return 'noop';
    }

    syntax(): string | RegExp {
        return VerbSyntax.noOp;
    }

    dependsOn(): Verb | null {
        return null;
    }

    usage(): string {
        return 'noop:<durationInMillis>';
    }

    requiresAuth(): boolean {
        return false;
    }
}
