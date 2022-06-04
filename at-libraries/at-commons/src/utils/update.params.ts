import { Metadata } from "../keystore";

/**
 * Update parameters interface.
 */
interface IUpdateParams {
    atKey?: string,
    value?: any,
    shardWith?: string,
    shardBy?: string,
    metadata?: Metadata,
}

/**
 * Update parameters class.
 */
export class UpdateParams implements IUpdateParams {

    /**
     * At key of update params
     */
    atKey?: string;

    /**
     * Value of update params
     */
    value?: any;

    /**
     * Shared with @sign
     */
    sharedWith?: string | null | undefined;

    /**
     * Shared by @sign
     */
    sharedBy?: string | null | undefined;

    /**
     * Metadata of update params
     */
    metadata?: Metadata;

    toJson(): string {
        return JSON.stringify(this);
    }

    static fromJson(json: string): UpdateParams {
        return JSON.parse(json);
    }
}