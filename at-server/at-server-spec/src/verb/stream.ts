import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

export class StreamVerb extends Verb {
    dependsOn(): Verb | null {
        return null;
    }

    name(): string {
        return 'stream';
    }

    requiresAuth(): boolean {
        return false;
    }

    syntax(): string | RegExp {
        return VerbSyntax.stream;
    }

    usage(): string {
        return '';
    }
}
