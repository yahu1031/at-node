
import { VerbSyntax } from "@sign/at-commons";
import { Cram } from "./cram";
import { Verb } from "./verb";

/**
 * The update meta verb updates the metadata of the keys in the secondary server. The update meta verb is used to set/update metadata of a key.
 * The @sign should be authenticated using cram verb prior to use the update meta verb.
 * A malformed request closes the @sign client connection.
 *
 * **ttl - time to live**
 * 
 *   Defines the time after which value should expire
 *   Accepts time duration in milliseconds.
 * 
 *   - `update:meta:@alice:location@bob:ttl:60000` - updates the existing ttl value to 60000 for the location
 * 
 * **ttb - time to born**
 * 
 *   Defines the time after which value should be displayed
 *   Accepts time duration in milliseconds
 * 
 *   - `update:meta:@alice:location@bob:ttb:60000` - updates the existing ttb value to 60000 for the location
 * 
 * **ttr:**
 * 
 *   Creates a cached key at the receiver side.
 *   Accepts a time duration in milli seconds which is a positive integer value to refresh the cached key or -1 to cache for forever.
 * 
 *   - `update:meta:@alice:location@bob:ttr:60000` - updates the existing ttb value to 60000 for the location
 */
export class UpdateMeta extends Verb {
    dependsOn(): Verb | null {
        return new Cram();
    }

    name(): string {
        return 'update:meta';
    }
    
    requiresAuth(): boolean  {
        return true;
    }

    syntax(): string | RegExp {
        return VerbSyntax.update_meta;
    }

    usage(): string {
        return 'update:meta:ttl:20000:ttb:20000:ttr:20000';
    }
}
