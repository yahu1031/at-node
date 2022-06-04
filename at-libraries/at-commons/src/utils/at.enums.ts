/**
 * Enum that specifies the Atkey type
 */
export enum AtKeyType {
    selfKey = 'selfKey',
    sharedKey = 'sharedKey',
    publicKey = 'publicKey',
    privateKey = 'privateKey',
    cachedPublicKey = 'cachedPublicKey',
    cachedSharedKey = 'cachedSharedKey',
    invalidKey = 'invalidKey'
}

/**
 * Enum that specifies Reserved key
 */
export enum ReservedKey {
    encryptionSharedKey = 'encryptionSharedKey',
    encryptionPublicKey = 'encryptionPublicKey',
    encryptionPrivateKey = 'encryptionPrivateKey',
    pkamPublicKey = 'pkamPublicKey',
    signingPrivateKey = 'signingPrivateKey',
    signingPublicKey = 'signingPublicKey',
    nonReservedKey = 'nonReservedKey'
}

/**
 * Regex group enum
 */
export enum RegexGroup {
    visibility = 'visibility',
    sharedWith = 'sharedWith',
    entity = 'entity',
    namespace = 'namespace',
    owner = 'owner',
}

/**
 * Enum that specifies the Operation
 */
export enum OperationEnum {
    update = 'update',
    delete = 'delete',
    append = 'append',
    remove = 'remove'
}

/**
 * Enum that specifies the Priority
 */
export enum PriorityEnum {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

/**
 * Enum that specifies the Strategy
 */
export enum StrategyEnum {
    all = 'all',
    latest = 'all'
}

/**
 * Enum that specifies the Message type
 */
export enum MessageTypeEnum {
    key = 'key',
    text = 'text'
}

/**
 * Shared key status
 */
export enum SharedKeyStatus {
    LOCAL_UPDATED = 'LOCAL_UPDATED',
    REMOTE_UPDATED = 'REMOTE_UPDATED',
    SHARED_WITH_NOTIFIED = 'SHARED_WITH_NOTIFIED',
    SHARED_WITH_LOOKED_UP = 'SHARED_WITH_LOOKED_UP',
    SHARED_WITH_READ = 'SHARED_WITH_READ',
}