import { AtError } from '../errors';
import * as validators from '.';
import { Regexes, RegexUtil, AtKeyType, RegexGroup, ReservedKey, AT_ENCRYPTION_SHARED_KEY, AT_ENCRYPTION_PUBLIC_KEY, AT_ENCRYPTION_PRIVATE_KEY, AT_PKAM_PUBLIC_KEY, AT_SIGNING_PRIVATE_KEY } from '../utils';
// import './../utils/ext.util';


/**
 * Returns an instance of `AtKeyValidator`
 */
export class AtKeyValidators {
    static get(): validators.AtKeyValidator {
        return new _AtKeyValidatorImpl();
    }
}

/**
 * Class responsible for validating the atKey.
 * Use `AtKeyValidators.get()` to get an instance of `_AtKeyValidatorImpl`
 */
class _AtKeyValidatorImpl extends validators.AtKeyValidator {
    private _regex!: string | RegExp;
    private _type!: AtKeyType;

    validate(key: string, context: validators.ValidationContext): validators.ValidationResult {
        // Init the state
        this._initParams(key, context);
        const validations: validators.Validation[] = [];
        validations.concat(new KeyLengthValidation(key));
        validations.concat(new KeyFormatValidation(key, this._regex, this._type));
        if (context.validateOwnership) {
            if (context.atSign == null || context.atSign!.isEmpty()) {
                throw new AtError(
                    'atSign should be set to perform ownership validation');
            }
            const matches: Map<string, string | undefined> = RegexUtil.matchesByGroup(this._regex, key);
            // If sharedWith is not specified default it to empty string.
            const sharedWith: string | null = matches.get(RegexGroup.sharedWith.toString()) ?? null;
            // If owner is not specified set it to a empty string
            const owner: string | null = matches.get(RegexGroup.owner) ?? null;
            if (sharedWith != null && owner != null) {
                validations.concat(new KeyOwnershipValidation(owner, context.atSign!, this._type));
                validations.concat(new KeyShareValidation(owner, sharedWith, this._type));
            }
        }

        for (var i = 0; i < validations.length; i++) {
            var result = validations[i]!.doValidate();
            if (!result.isValid) {
                return result;
            }
        }
        return validators.ValidationResult.noFailure();
    }

    private _initParams(key: string, context: validators.ValidationContext): void {
        // If the atSign is passed with @ remove it.
        context.atSign = context.atSign!.replace(RegExp('^@'), '');
        // If context.type is null, setType and regex.
        if (context.type == null) {
            this._setTypeAndRegex(key);
            return;
        }
        // if the type of the key is passed in the validation use that to init the regex
        this._type = context.type!;
        this._setRegex(context.type!);
    }

    private _setTypeAndRegex(key: string): void {
        this._type = RegexUtil.keyType(key);
        this._setRegex(this._type);
    }

    private _setRegex(type: AtKeyType): void {
        switch (type) {
            case AtKeyType.publicKey:
                this._regex = Regexes.publicKey;
                break;
            case AtKeyType.privateKey:
                this._regex = Regexes.privateKey;
                break;
            case AtKeyType.selfKey:
                this._regex = Regexes.selfKey;
                break;
            case AtKeyType.sharedKey:
                this._regex = Regexes.sharedKey;
                break;
            case AtKeyType.cachedPublicKey:
                this._regex = Regexes.cachedPublicKey;
                break;
            case AtKeyType.cachedSharedKey:
                this._regex = Regexes.cachedSharedKey;
                break;
            case AtKeyType.invalidKey:
                this._regex = '';
                break;
        }
    }
}

/**
 * Verifies if the key belongs to reserved key list.
 */
export class ReservedEntityValidation extends validators.Validation {
    key!: string;

    constructor(key: string) {
        super();
        this.key = key;
    }


    doValidate(): validators.ValidationResult {
        // If key is in reserved key list, return false.
        var reservedKey = this._reservedKey(this.key);
        const _reservedKeyArray = Object.values(ReservedKey);
        const _rkaLength = _reservedKeyArray.length;
        if (reservedKey != ReservedKey.nonReservedKey &&
            _reservedKeyArray.slice(_rkaLength / 2).includes(reservedKey)) {
            return new validators.ValidationResult('Reserved key cannot be created');
        }
        return validators.ValidationResult.noFailure();
    }

    /**
     * Returns the `ReservedKey` enum for given key.
     */
    private _reservedKey(key: string): ReservedKey {
        if (key == this._getEntityFromConstant(AT_ENCRYPTION_SHARED_KEY)) {
            return ReservedKey.encryptionSharedKey;
        }
        if (key == this._getEntityFromConstant(AT_ENCRYPTION_PUBLIC_KEY)) {
            return ReservedKey.encryptionPublicKey;
        }
        if (key == this._getEntityFromConstant(AT_ENCRYPTION_PRIVATE_KEY)) {
            return ReservedKey.encryptionPrivateKey;
        }
        if (key == this._getEntityFromConstant(AT_PKAM_PUBLIC_KEY)) {
            return ReservedKey.pkamPublicKey;
        }
        if (key == this._getEntityFromConstant(AT_SIGNING_PRIVATE_KEY)) {
            return ReservedKey.signingPrivateKey;
        }
        return ReservedKey.nonReservedKey;
    }

    /// Returns the entity part from the key constants.
    /// Eg: AT_ENCRYPTION_PUBLIC_KEY = 'public:publickey';
    ///     return 'publickey';
    private _getEntityFromConstant(key: string): string {
        if (key.includes(':')) {
            return key.split(':')[1]!;
        }
        return key;
    }
}

/// Validates key length of a @sign
class KeyLengthValidation extends validators.Validation {
    private maxKeyLength: number = 240;
    key!: string;

    constructor(key: string) {
        super();
        this.key = key;
    }

    doValidate(): validators.ValidationResult {
        if (this.key.length > this.maxKeyLength) {
            return new validators.ValidationResult(
                `Key length exceeds maximum permissible length of ${this.maxKeyLength} characters`);
        }
        return validators.ValidationResult.noFailure();
    }
}

/// Validates if the Key adheres to a format represented by a regex
class KeyFormatValidation extends validators.Validation {
    key!: string;
    regex!: string | RegExp;
    type!: AtKeyType;

    constructor(key: string, regex: string | RegExp, type: AtKeyType) {
        super();
        this.key = key;
        this.regex = regex;
        this.type = type;
    }

    doValidate(): validators.ValidationResult {
        if (this.type == AtKeyType.invalidKey) {
            return new validators.ValidationResult(`${this.key} is not a valid key`);
        }

        const match: boolean = RegexUtil.matchAll(this.regex, this.key);
        if (!match) {
            return new validators.ValidationResult(`${this.key} does not adhere to the regex ${this.regex}`);
        }
        return validators.ValidationResult.noFailure();
    }
}

/// Validates if the ownership is right for a given key type
class KeyOwnershipValidation extends validators.Validation {
    owner: string; atSign: string;
    type: AtKeyType;

    constructor(owner: string, atSign: string, type: AtKeyType) {
        super();
        this.owner = owner;
        this.atSign = atSign;
        this.type = type;
    }

    doValidate(): validators.ValidationResult {
        // Ownership rules:
        // ------------------
        // Rule 1: For a cached key owner should be different from the current @sign.
        // Rule 2: For a non cached key owner should be same as the current @sign.
        // A non cached key can be Public, Private, Hidden or just a self key
        if ((this.type == AtKeyType.cachedPublicKey || this.type == AtKeyType.cachedSharedKey) &&
            (this.owner == this.atSign)) {
            return new validators.ValidationResult(
                `Owner of the key ${this.owner} should not be same as the the current @sign ${this.atSign} for a cached key`);
        }
        if ((this.type != AtKeyType.cachedPublicKey && this.type != AtKeyType.cachedSharedKey) &&
            this.owner != this.atSign) {
            return new validators.ValidationResult(
                `Owner of the key ${this.owner} should be same as current @sign atSign`);
        }
        return validators.ValidationResult.noFailure();
    }
}

/**
 * Validates if key is rightly shared
 */
class KeyShareValidation extends validators.Validation {
    owner!: string;
    sharedWith!: string;
    type!: AtKeyType;

    constructor(owner: string, sharedWith: string, type: AtKeyType) {
        super();
        this.owner = owner;
        this.sharedWith = sharedWith;
        this.type = type;
    }

    doValidate(): validators.ValidationResult {
        // Ownership rules:
        // ------------------
        // Rule 1: For a self key if sharedWith is present it should be same as the @sign
        // Rule 2: For a shared key sharedWith should be different from the current @sign

        if ((this.type == AtKeyType.selfKey) &&
            this.sharedWith.isNotEmpty() &&
            this.owner != this.sharedWith) {
            return new validators.ValidationResult(
                `For a self key owner ${this.owner} should be same as with whom it is shared with ${this.sharedWith}.`);
        }
        if (this.type == AtKeyType.sharedKey && this.sharedWith.isEmpty()) {
            return new validators.ValidationResult(
                `Shared with cannot be null for a shared key ${this.sharedWith}`);
        }
        if (this.type == AtKeyType.sharedKey && this.owner == this.sharedWith) {
            return new validators.ValidationResult(
                `For a shared key owner ${this.owner} should not be same as with whom it is shared with ${this.sharedWith}.`);
        }
        return validators.ValidationResult.noFailure();
    }
}
