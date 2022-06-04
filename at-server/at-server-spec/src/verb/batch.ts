
import { VerbSyntax } from "@sign/at-commons";
import {Pkam} from './pkam'
/** 
 * Batch verb is used for executing multiple verbs at a time.
 *
 * syntax: `batch:<json with commands>`
 */
export class Batch extends Verb {
    name(): string {
        return "batch";
    }

    syntax(): string | RegExp {
        return VerbSyntax.batch;
    }

    dependsOn(): Verb | null {
        return new Pkam();
    }

    usage(): string {
        return 'e.g batch:[{"id":1, "commmand":"update:location@alice newyork"},{"id":2, "commmand":"delete:location@alice"}]';
    }

    requiresAuth(): boolean {
        return true;
    }
}
