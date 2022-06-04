import { AtKeyError } from "../../errors";
import { AtKeyValidators, ValidationContext } from "../../validator";
import { AtKey, Metadata } from "..";
// import '../../utils/ext.util';

/**
 *  Builder to build instances of AtKey's 
 */
export interface KeyBuilder {
    /**
     * Returns an instance of AtKey
     */
    build(): AtKey;

    /**
     * Validates AtKey and throws Error for a given context
     */
    validate(): void;

    /**
     * Set simple key without any namespace. 
     * For example 'phone', 'email' etc...
     */
    key(key: string): void;

    /**
     * Each app should write to a specific namespace.
     */
    namespace(namespace: string): void;

    /**
     * Set this value to set an expiry to a key in milliseconds.
     * Time until expiry
     */
    timeToLive(ttl: number): void;

    /** 
     * Set this value to set time after which the key should be available in milliseconds.
     * Time until availability
     */
    timeToBirth(ttb: number): void;

    /**
     * Set the current AtSign
     * 
     * `This is required.`
     */
    sharedBy(atSign: string): void;
}

/**
 * Atkey builder
 */
export abstract class AtKeyBuilder implements KeyBuilder {

    _atKey: AtKey = new AtKey();
    _metaData: Metadata = new Metadata();

    build(): AtKey {
        this.validate();
        this._atKey.metadata = this._metaData;
        return this._atKey;
    }

    validate(): void {
        if (this._atKey.key!.isEmpty()) {
            throw new AtKeyError('Key cannot be empty');
        }
        if (this._atKey.key == null) {
            throw new AtKeyError('Key cannot be null',);
        }
        /**
         * validate the atKey
         * Setting the validateOwnership to false to skip KeyOwnerShip validation and
         * KeyShare validation. These validation will be performed on put and get of the key.
         */
        let validationContext = new ValidationContext();
        validationContext.validateOwnership = false
        AtKeyValidators.get()
            .validate(this.toString(), validationContext);
    }

    key(key: string): void {
        key.trim();
        this._atKey.key = key;
    }

    namespace(namespace?: string): void {
        namespace = namespace?.trim();
        this._atKey.namespace = namespace ?? null;
    }

    timeToLive(ttl?: number | null): void {
        this._metaData.ttl = ttl!;
    }

    timeToBirth(ttb?: number): void {
        this._metaData.ttb = ttb!;
    }

    sharedBy(atSign?: string): void {
        this._atKey.sharedBy = atSign ?? null;
    }
}