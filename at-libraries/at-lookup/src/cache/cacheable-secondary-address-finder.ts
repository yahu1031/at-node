import { AtError, SecondaryNotFoundError } from "@sign/at-commons";
import { AtLogger } from "@sign/at-utils";
import { LookUpUtil } from "../utils/lookup.util";
import './../utils/ext.util';
import { SecondaryAddressCacheEntry } from "./secondary-address-cache-entry";
import { SecondaryAddress, SecondaryAddressFinder, SecondaryUrlFinder } from "./secondary-finder";

export class CacheableSecondaryAddressFinder implements SecondaryAddressFinder {
    private _defaultCacheDuration = 3600000; // 1 hour

    private _logger = new AtLogger('CacheableSecondaryAddressFinder');

    private _map: Map<string, SecondaryAddressCacheEntry> = new Map();

    private _rootDomain: string;

    private _port: number;

    private _secondaryFinder!: SecondaryUrlFinder;

    constructor(rootDomain: string, port: number, secondaryFinder?: SecondaryUrlFinder) {
        this._rootDomain = rootDomain;
        this._port = port;
        this._secondaryFinder = secondaryFinder ?? new SecondaryUrlFinder(this._rootDomain, this._port);
    }

    cacheOptions(atSign: string): boolean {
        return this._map.has(this.stripAtSignFromAtSign(atSign));
    }

    async findSecondaryAddress(atSign: string): Promise<string> {
        atSign = this.stripAtSignFromAtSign(atSign);
        if (this._cacheIsEmptyOrExpired(atSign)) {
            await this._updateCache(atSign, this._defaultCacheDuration);
        }

        if (this._map.has(atSign)) {
            return this._map.get(atSign)!.secondaryAddress.toString();
        } else {
            throw new AtError(`Unable to find secondary address for atSign: ${atSign}`);
        }
    }

    private stripAtSignFromAtSign(atSign: string): string {
        if (atSign.startsWith('@')) {
            atSign = atSign.replaceFirst('@', '');
        }
        return atSign;
    }

    getCacheExpiryTime(atSign: string): number | null {
        atSign = this.stripAtSignFromAtSign(atSign);
        if (this._map.has(atSign)) {
            return this._map.get(atSign)!.expiresAt;
        }
        return 0;
    }

    private _cacheIsEmptyOrExpired(atSign: string): boolean {
        if (this._map.has(atSign)) {
            var entry: SecondaryAddressCacheEntry = this._map.get(atSign)!;
            if (entry.expiresAt < new Date().getTime()) {
                // expiresAt is in the past - cache has expired
                return true;
            } else {
                // cache has not yet expired
                return false;
            }
        } else {
            // cache is empty
            return true;
        }
    }
    private async _updateCache(atSign: string, cacheFor: number): Promise<void> {
        try {
            var secondaryUrl: string | null = await this._secondaryFinder.findSecondaryUrl(atSign);
            if (secondaryUrl == null ||
                secondaryUrl.isEmpty() ||
                secondaryUrl == 'data:null') {
                throw new SecondaryNotFoundError(`Unable to find secondary address for atSign:${atSign}`);
            }
            var secondaryInfo = LookUpUtil.getSecondaryInfo(secondaryUrl);
            var secondaryHost: string = secondaryInfo[0];
            var secondaryPort = parseInt(secondaryInfo[1]);

            var addr = new SecondaryAddress(secondaryHost, secondaryPort);
            this._map.set(atSign, new SecondaryAddressCacheEntry(
                addr, new Date().getTime() + cacheFor));
        } catch (e: any) {
            this._logger
                .error(`Unable to find secondary address for atSign:${atSign} - ${e.toString()}`);
            throw new AtError(e.toString());
        }
    }

}