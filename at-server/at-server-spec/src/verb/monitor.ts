import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * Monitor verb is used to stream incoming connections from the secondary server to the client.
 * The “monitor:” verb is used to monitor either all or specific notification events that are sent using the “notify:” verb.
 * Optionally pass a regex to stream only notifications that match the regex.
 * e.g. monitor or monitor .wavi
 */
export class Monitor extends Verb {
    
    dependsOn(): Verb | null {
        return null;
    }

    name(): string { return 'monitor'; }

    requiresAuth(): boolean {
        return true;
    }

    syntax(): string | RegExp { return VerbSyntax.monitor; }

    usage(): string {
        return 'e.g. monitor or monitor .wavi';
    }
}
