import { VerbSyntax } from "@sign/at-commons";
import { Verb } from "./verb";

/** 
 * The "info" verb returns a JSON object as follows:
 * ```json
 * {
 *   "version" : "the version being run",
 *   "uptimeAsWords" : "uptime as string: D days, H hours, M minutes, S seconds",
 *   "features" : [
 *     {
 *       "name" : "ID of feature 1",
 *       "status" : "One of Preview, Beta, GA",
 *       "description" : "Description of feature"
 *     },
 *     {
 *       "name" : "ID of feature 2",
 *       "status" : "One of Preview, Beta, GA",
 *       "description" : "Description of feature"
 *     },
 *     ...
 *   ]
 * }
 * ```
 * `info:brief` will just return the version and uptime as milliseconds
 * ```json
 * {
 *   "version" : "the version being run",
 *   "uptimeAsMillis" : "uptime in milliseconds, as integer",
 * }
 * ```
 *
 * This verb _does not_ require authentication.
 *
 * **Syntax**: `info`
 */
export class Info extends Verb {
    name(): string {
        return 'info';
    }

    syntax(): string | RegExp {
        return VerbSyntax.info;
    }

    dependsOn(): Verb | null {
        return null;
    }

    usage(): string {
        return 'info';
    }

    requiresAuth(): boolean {
        return false;
    }
}
