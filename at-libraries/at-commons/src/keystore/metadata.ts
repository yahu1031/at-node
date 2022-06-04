/**
 * Interface for the metadata.
 */
interface IMetaData {
    /**
     * Time to live in milliseconds.
     */
    ttl?: number | null;
    /**
     * Time to birth in milliseconds.
     */
    ttb?: number | null;
    /**
     * Time in milliseconds after which the 
     * cached key needs to be refreshed. 
     * Ttr of -1 indicates that the key can be cached forever.
     */
    ttr?: number | null;
    /**
     * Indicates if a cached key 
     * needs to be deleted when the @sign 
     * user who has originally shared it deletes it.
     */
    ccd?: boolean | false;
    /**
     * A Date and Time derived from the ttl (now + ttl). 
     * A Key should be only available after availableAt.
     */
    availableAt?: Date | null;
    /**
     * Date and time when the key has been created.
     */
    createdAt?: Date | null;
    /**
     * Date and time when the key has been last updated.
     */
    updatedAt?: Date | null;
    /**
     * A Date and Time derived from the ttl (now + ttl). 
     * A Key should be auto deleted once it expires.
     */
    expiresAt?: Date | null;
    /**
     * A Date and Time derived from the ttr. 
     * The time at which the key gets refreshed.
     */
    refreshAt?: Date | null;
    /**
     * 
     */
    dataSignature?: string | null;
    /**
     * 
     */
    sharedkeyStatus?: string | null;
    /**
     * Indicates if key is public(true) or private(false).
     */
    isPublic: boolean;
    /**
     * Indicates if key is hidden(true) or not(false).
     */
    isHidden: boolean;
    /**
     * Indicates if the key is aware of the namespace.
     */
    namespaceAware: boolean;
    /**
     * True if the value is a binary value.
     */
    isBinary: boolean;
    /**
     * True if the value is encrypted
     */
    isEncrypted?: boolean | false;
    /**
     * True if the key can be cached by another @sign user.
     */
    isCached: boolean;
    /**
     * 
     */
    sharedKeyEnc?: string | null;
    /**
     * 
     */
    pubKeyCS?: string | null;
}

export class Metadata implements IMetaData {
    ttl?: number | null;
    ttb?: number | null;
    ttr?: number | null;
    ccd?: boolean | false;
    availableAt?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    expiresAt?: Date | null;
    refreshAt?: Date | null;
    dataSignature?: string | null;
    sharedkeyStatus?: string | null;
    isPublic: boolean = false;
    isHidden: boolean = false;
    namespaceAware: boolean = true;
    isBinary: boolean = false;
    isEncrypted?: boolean | false;
    isCached: boolean = false;
    sharedKeyEnc?: string | null;
    pubKeyCS?: string | null;

    /**
     * Converts a json string to Metadata object.
     * @param json 
     * @returns meta data 
     */
    public toMetaData(json: string): Metadata {
        return JSON.parse(json);
    }

    /**
     * Convert a Metadata object to json string.
     * @returns json 
     */
    public toJson(): string {
        return JSON.stringify(this);
    }
}