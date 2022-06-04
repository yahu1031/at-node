import { AtLogger } from "../logger/atlogger";
import './ext-helper';

/**
 * Utility class for `Metadata` operations
 */
export class AtMetadataUtil {
    private static _instance: AtMetadataUtil = new AtMetadataUtil();

    private _logger = new AtLogger('AtMetadataUtil');

    /**
     * Creates an instance of at metadata util.
     */
    private constructor() {
        if (AtMetadataUtil._instance) {
            throw this._logger.error("Error: Instantiation failed: Use AtMetadataUtil.getInstance() instead of new.");
        }
        AtMetadataUtil._instance = this;
    }

    /**
     * Gets instance
     * @returns singletone instance 
     */
    public static getInstance(): AtMetadataUtil {
        return AtMetadataUtil._instance;
    }


    /**
     * Accepts a string which represents the MillisecondsSinceEpoch
     * Returns `ttlMs` which is time_to_live in MilliSecondsSinceEpoch
     * Method ensures `ttl` has a valid value
     * @param [ttl] 
     * @returns {number} number as MillisecondsSinceEpoch
     */
    public validateTTL(ttl?: string): number | undefined {
        let ttlMs: number = 0;
        if (!ttl || ttl.trim().isEmpty()) {
            return ttlMs;
        }
        ttlMs = parseInt(ttl);
        /** 
        * TTL cannot have a negative value and must be a number.
        */
        if (ttlMs < 0 || ttlMs === NaN) {
            this._logger.error('Valid value for TTL should be greater than or equal to 0');
            return;
            // throw new TypeError(
            //     'Valid value for TTL should be greater than or equal to 0');
        }
        return ttlMs;
    }

    /** 
     * Accepts a string which represents the MillisecondsSinceEpoch
     * Returns `ttlMs` which is time_to_birth in MilliSecondsSinceEpoch
     * Method ensures `ttb` has a valid value
     * 
     * @param [ttb]
     * @returns {number} number as MillisecondsSinceEpoch
     */
    public validateTTB(ttb?: string): number | undefined {
        let ttbMs: number = 0;
        if (!ttb || ttb.trim().isEmpty()) {
            return ttbMs;
        }
        /**
         * TTB cannot have a negative value.
         */
        ttbMs = parseInt(ttb);
        if (ttbMs < 0 || ttbMs === NaN) {
            this._logger.error('Valid value for TTB should be greater than or equal to 0');
            return;
            // throw new TypeError(
            //     'Valid value for TTB should be greater than or equal to 0');
        }
        return ttbMs;
    }

    /**
     * Accepts a number which represents the MillisecondsSinceEpoch
     * Returns `ttrMs` which is time_to_refresh in MilliSecondsSinceEpoch
     * Method ensures `ttr_ms` has a valid value
     * 
     * @param [ttr_ms]
     * @returns {number | null} number as MillisecondsSinceEpoch
     */
    public validateTTR(ttr_ms?: number): number | null {
        if (ttr_ms == null || ttr_ms == 0) {
            return null;
        }
        if (ttr_ms <= -2) {
            this._logger.error(
                'Valid values for TTR are -1 and greater than or equal to 1');
            return null;
        }
        return ttr_ms;
    }

    /**
     * Validates cascade delete
     * @param {number | null | undefined} [ttr] 
     * @param {boolean | null | undefined} [isCascade] 
     * @returns {boolean | null} true or false 
     */
    static validateCascadeDelete(ttr?: number, isCascade?: boolean): boolean | null {
        // When ttr is 0 or null, key is not cached, hence setting isCascade to null.
        if (ttr == 0 || ttr == null) {
            return null;
        }
        isCascade = isCascade || false;
        return isCascade;
    }

    /**
     * Gets bool verb params
     * @param {string | null | undefined} [value] 
     * @returns {boolean} [true | false]
     */
    public getBoolVerbParams(value?: string): boolean {
        if (value || value != null) {
            return value.toLowerCase() === 'true';
        }
        return false;
    }
}