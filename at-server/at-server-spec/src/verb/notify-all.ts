import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * The “notify:all” allows to notify multiple @sign's at the same time .
 * The @sign should be authenticated using the cram/pkam verb prior to use the notify verb.
 * A malformed request closes the @sign client connection.
 *
 * Syntax: `notify:<atsign's to notify>:<key to notify>@<sender AtSign>`
 * 
 * Optionally following preferences can be set
 * 
 * 1) messageType: KEY, TEXT
 *   This field indicates the type of notification. This is an optional field. Defaults to Key.
 * 
 * **KEY: To notify a key**
 * 
 *  Example: `notify:all:messageType:key:@colin:phone@kevin`
 * 
 * **TEXT: To notify a message.**
 * 
 *  Example: `notify:all:messageType:text:@colin:hi`
 * 
 * 2) operation: UPDATE, DELETE
 *    This field indicates the operation. This is an optional field. Defaults to update
 *  
 * **Type: update**
 *    
 *  Example: `notify:update:key:@alice:phone@bob:+91-90192019201`
 * 
 * **Type:delete**
 *  
 *  Example: `notify:delete:key:@alice:phone@bob`
 */
export class NotifyAll extends Verb {

    name(): string {
        return 'notifyAll';
    }


    syntax(): string | RegExp {
        return VerbSyntax.notifyAll;
    }


  dependsOn(): Verb | null {
        return null;
    }


  usage(): string {
        return 'e.g notify:all:@alice,@bob:key1@colin';
    }


  requiresAuth(): boolean {
        return false;
    }
}
