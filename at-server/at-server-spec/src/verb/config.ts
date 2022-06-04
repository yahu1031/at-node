import { VerbSyntax } from "@sign/at-commons";

/** 
 * The `config` verb is used for configuring or viewing an @sign’s block/allow list.
 * 
 * `from` verb functionality is determined by using the configurations of `config` verb.
 * 
 * If an atsign is in block list, secondary server won’t allow it for authentication.
 * 
 * The @sign should be authenticated using cram/pkam verb prior to use the `config` verb.
 * 
 * **configuration syntax**: `block:[add/remove]:[@sign list]`.
 * 
 * **view syntax**: `block:show`.
 * ```txt
 * e.g.
 *   1. config:block:add:@alice @bob //adds @alice, @bob into block list.
 *   2. config:block:remove:@alice //removes @alice from block list.
 *   3. config:block:show //displays block list @signs.
 * ```
 */
export class Config extends Verb {
    dependsOn(): Verb | null {
        return null;
    }

    name(): string { return 'config'; }

    requiresAuth(): boolean {
        return true;
    }

    syntax(): string | RegExp {
        return VerbSyntax.config;
    }

    usage(): string {
        return 'configure syntax config:block:<action>:@<atSign> \n e.g config:block:add:@alice \n view syntax config:show:<type> \n e.g config:shoe:allow';
    }
}
