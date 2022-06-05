/**
 * Status of an `@sign`
 */
export enum AtSignStatus {
    notFound = 'notFound',
    teapot = 'teapot',
    activated = 'activated',
    unavailable = 'unavailable',
    error = 'error',
}

/**
 * Root status
 */
export enum RootStatus {
    found = 'found',
    notFound = 'notFound',
    stopped = 'stopped',
    unavailable = 'unavailable',
    error = 'error',
}

/**
 * Server status
 */
export enum ServerStatus {
    ready = 'ready',
    teapot = 'teapot',
    activated = 'activated',
    stopped = 'stopped',
    unavailable = 'unavailable',
    error = 'error',
}