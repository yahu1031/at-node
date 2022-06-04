import { AtKeyError } from "../errors";
import { Metadata } from ".";
import { AT_ENCRYPTION_PRIVATE_KEY, AT_PKAM_PRIVATE_KEY, AT_PKAM_PUBLIC_KEY, CACHED } from "../utils";

/**
 * Interface for AtKey
 */
interface IAtKey {
    key?: string;
    sharedWith?: string | null;
    sharedBy?: string | null;
    namespace?: string | null;
    isRef: boolean;
    metadata?: Metadata | null;
}

/**
 * AtKey is the base class for all key types. 
 * It is used to store the key and it's metadata.
 */
export class AtKey implements IAtKey {
    /**
     * key is basically a name of the AtKey.
     */
    key?: string;
    /**
     * The AtKey to whom shared with.
     */
    sharedWith?: string | null;
    /**
     * The AtKey shared by whom. This refers the key created by whom.
     */
    sharedBy?: string | null;
    /**
     * Namespace is where a set of AtKeys are grouped by.
     */
    namespace?: string | null;
    /**
     * Determines whether is refered or not.
     */
    isRef: boolean = false;
    /**
     * Metadata of the key.
     */
    metadata?: Metadata | null;

    /**
     * Converts the AtKey json string to AtKey object
     * @param {string} json
     * @returns {AtKey} AtKey
     */
    public toAtKey(json: string): AtKey {
        return JSON.parse(json);
    }

    /**
     * Converts to json string
     * @returns {string} json 
     */
    public toJson(): string {
        return JSON.stringify(this);
    }

    // /**
    //  * Public keys are visible to everyone and 
    //  * shown in an authenticated/unauthenticated scan
    //  * @param key 
    //  * @param [namespace]
    //  * @param [sharedBy] 
    //  * @returns {PublicKeyBuilder} PublicKeyBuilder
    //  */
    // public public(key: string,
    //     namespace?: string, sharedBy?: string): PublicKeyBuilder {
    //     const _builder = new PublicKeyBuilder();
    //     _builder.key(key!);
    //     _builder.sharedBy(sharedBy!);
    //     _builder.namespace(namespace!);
    //     return _builder;
    // }

    // /**
    //  * Private key's that are created by the 
    //  * owner of the atSign and these keys are not shown in the scan.
    //  * @param key 
    //  * @param {string | null}  [namespace] 
    //  * @returns {PrivateKeyBuilder} PrivateKeyBuilder 
    //  */
    // public private(key: string, namespace?: string): PrivateKeyBuilder {
    //     const _builder = new PrivateKeyBuilder();
    //     _builder.key(key);
    //     _builder.namespace(namespace!);
    //     return _builder;
    // }

    // /**
    //  * Self keys that are created by the owner of the atSign 
    //  * and the keys can be accessed by the owner of the atSign only.
    //  * @param key 
    //  * @param [namespace] 
    //  * @param [sharedBy] 
    //  * @returns self 
    //  */
    // public self(key: string,
    //     namespace?: string, sharedBy?: string): SelfKeyBuilder {
    //     const _builder = new SelfKeyBuilder();
    //     _builder.key(key!);
    //     _builder.sharedBy(sharedBy!);
    //     _builder.namespace(namespace!);
    //     return _builder;
    // }

    // /**
    //  * Shared Keys are shared with other atSign.
    //  * The owner can see the keys on authenticated scan. 
    //  * The SharedWith atSign can lookup the value of the key.
    //  * @param key 
    //  * @param [namespace] 
    //  * @param [sharedBy] 
    //  * @returns shared 
    //  */
    // public shared(key: string,
    //     namespace?: string, sharedBy?: string): SharedKeyBuilder {
    //     const _builder = new SharedKeyBuilder();
    //     _builder.key(key!);
    //     _builder.sharedBy(sharedBy!);
    //     _builder.namespace(namespace!);
    //     return _builder;
    // }

    /**
     * Convert the stringified key to a AtKey
     * @param key 
     * @returns string 
     */
    fromString(key: string): AtKey {
        const atKey = new AtKey();
        const metadata = new Metadata();
        if (key.startsWith(AT_PKAM_PRIVATE_KEY) ||
            key.startsWith(AT_PKAM_PUBLIC_KEY)) {
            atKey.key = key;
            atKey.metadata = metadata;
            return atKey;
        } else if (key.startsWith(AT_ENCRYPTION_PRIVATE_KEY)) {
            atKey.key = key.split('@')[0]!;
            atKey.sharedBy = key.split('@')[1] ?? null;
            atKey.metadata = metadata;
            return atKey;
        }
        //If key does not contain '@'. or key has space, it is not a valid key.
        if (!key.includes('@') || key.includes(' ')) {
            throw new AtKeyError(`${key} is not well-formed key`);
        }
        var keyParts = key.split(':');
        // If key does not contain ':' Ex: phone@bob; then keyParts length is 1
        // where phone is key and @bob is sharedBy
        if (keyParts.length == 1) {
            atKey.sharedBy = keyParts[0]?.split('@')[1]!;
            atKey.key = keyParts[0]?.split('@')[0]!;
        } else {
            // Example key: public:phone@bob
            if (keyParts[0] == 'public') {
                metadata.isPublic = true;
            }
            // Example key: cached:@alice:phone@bob
            else if (keyParts[0] == CACHED) {
                metadata.isCached = true;
                atKey.sharedWith = keyParts[1]!;
            } else {
                atKey.sharedWith = keyParts[0]!;
            }
            let keyArr: string[] = [];
            if (keyParts[0] == CACHED) {
                keyArr = keyParts[2]?.split('@')!;
            } else {
                keyArr = keyParts[1]?.split('@')!;
            }
            if (keyArr.length == 2) {
                atKey.sharedBy = keyArr[1]!;
                atKey.key = keyArr[0]!;
            } else {
                atKey.key = keyArr[0]!;
            }
        }
        //remove namespace
        if (atKey.key != null && atKey.key!.includes('.')) {
            var namespaceIndex = atKey.key!.lastIndexOf('.');
            if (namespaceIndex > -1) {
                atKey.namespace = atKey.key!.substring(namespaceIndex + 1);
                atKey.key = atKey.key!.substring(0, namespaceIndex);
            }
        } else {
            metadata.namespaceAware = false;
        }
        atKey.metadata = metadata;
        return atKey;
    }
}