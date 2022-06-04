import { AtKeyType, RegexGroup } from '.';

export class Regexes {
    private static _charsInNamespace: RegExp = /([\w])+/;
    private static _charsInAtSign: RegExp = /[\w\-_]/;
    private static _charsInEntity: RegExp = /[\w\.\-_\'*"]/;
    private static _allowedEmoji: RegExp =
        /((\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))/;

    // Ideally these should be mutually exclusive, 
    // and they are. Will write tests for that.
    static publicKey: RegExp =
        RegExp(`(?<visibility>(public:){1})((@(?<sharedWith>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55}):))?(?<entity>(${Regexes._charsInEntity}|${Regexes._allowedEmoji})+)\\.(?<namespace>${Regexes._charsInNamespace})@(?<owner>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55})`);
    static privateKey: RegExp =
        RegExp(`(?<visibility>(private:){1})((@(?<sharedWith>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55}):))?(?<entity>(${Regexes._charsInEntity}|${Regexes._allowedEmoji})+)\\.(?<namespace>${Regexes._charsInNamespace})@(?<owner>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55})`);
    static selfKey: RegExp =
        RegExp(`((@(?<sharedWith>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55}):))?(_*(?<entity>(${Regexes._charsInEntity}|${Regexes._allowedEmoji})+))\\.(?<namespace>${Regexes._charsInNamespace})@(?<owner>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55})`);
    static sharedKey: RegExp =
        RegExp(`((@(?<sharedWith>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55}):))(_*(?<entity>(${Regexes._charsInEntity}|${Regexes._allowedEmoji})+))\\.(?<namespace>${Regexes._charsInNamespace})@(?<owner>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55})`);
    static cachedSharedKey: RegExp =
        RegExp(`((cached:)(@(?<sharedWith>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55}):))(_*(?<entity>(${Regexes._charsInEntity}|${Regexes._allowedEmoji})+))\\.(?<namespace>${Regexes._charsInNamespace})@(?<owner>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55})`);
    static cachedPublicKey: RegExp =
        RegExp(`(?<visibility>(cached:public:){1})((@(?<sharedWith>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55}):))?(?<entity>(${Regexes._charsInEntity}|${Regexes._allowedEmoji})+)\\.(?<namespace>${Regexes._charsInNamespace})@(?<owner>(${Regexes._charsInAtSign}|${Regexes._allowedEmoji}){1,55})`);
}

export class RegexUtil {
    /// Returns a first matching key type after matching the key against regexes for each of the key type
    static keyType(key: string): AtKeyType {
        // matches the key with public key regex.
        if (RegexUtil.matchAll(Regexes.publicKey, key)) {
            return AtKeyType.publicKey;
        }
        // matches the key with private key regex.
        if (RegexUtil.matchAll(Regexes.privateKey, key)) {
            return AtKeyType.privateKey;
        }
        // matches the key with self key regex.
        if (RegexUtil.matchAll(Regexes.selfKey, key)) {
            const matches: Map<string, string | undefined> =
                RegexUtil.matchesByGroup(Regexes.selfKey, key);
            const sharedWith: string | null = matches.get(RegexGroup.sharedWith) ?? null;
            // If owner is not specified set it to a empty string
            const owner: string | null = matches.get(RegexGroup.owner) ?? null;
            if ((owner != null && owner.isNotEmpty()) &&
                (sharedWith != null && sharedWith.isNotEmpty()) &&
                owner != sharedWith) {
                return AtKeyType.sharedKey;
            }
            return AtKeyType.selfKey;
        }
        if (RegexUtil.matchAll(Regexes.cachedPublicKey, key)) {
            return AtKeyType.cachedPublicKey;
        }
        if (RegexUtil.matchAll(Regexes.cachedSharedKey, key)) {
            return AtKeyType.cachedSharedKey;
        }
        return AtKeyType.invalidKey;
    }

    /// Matches a regex against the input.
    /// Returns a true if the regex is matched and a false otherwise
    static matchAll(regex: string | RegExp, input: string): boolean {
        const regExp = new RegExp(regex, 'i');
        return regExp.test(input) &&
            regExp.exec(input)!.length == input.length;
    }

    /// Returns a [Map] containing named groups and the matched values in the input
    /// Returns an empty [Map] if no matches are found
    static matchesByGroup(regex: string | RegExp, input: string): Map<string, string | undefined> {
        var regExp = RegExp(regex, 'i');
        const matches = regExp.exec(input);
        const paramsMap = new Map<string, string | undefined>();

        if (matches == null || matches.isEmpty()) {
            return paramsMap;
        }
        for (const key in matches.groups) {
            paramsMap.putIfAbsent(key, () => matches.groups![key]);
        }
        return paramsMap;
    }
}
