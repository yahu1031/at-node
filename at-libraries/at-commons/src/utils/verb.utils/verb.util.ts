export class VerbUtil {
    static newLineReplacePattern: string = '~NL~';

    static _getMatches(regex: RegExp | string, command: string): IterableIterator<RegExpMatchArray> {
        var _regex = RegExp(regex);
        var matches = command.matchAll(_regex);
        return matches;
    }

    static _processMatches(
        matches: IterableIterator<RegExpMatchArray>): Map<string, string | null> {
        var paramsMap = new Map<string, string | null>();
        for (const match of matches) {
            for (const key in match.groups) {
                paramsMap.putIfAbsent(key, () => match.groups![key]!);
            }
        }
        return paramsMap;
    }

    static formatAtSign(atSign?: string): string | undefined {
        if ((atSign !== null || atSign !== undefined) && !atSign?.startsWith('@')) {
            atSign = `@${atSign}`;
        }
        return atSign;
    }

    static replaceNewline(value: string): string {
        return value.replaceAll('\n', this.newLineReplacePattern);
    }

    static getFormattedValue(value: string): string {
        return value.replaceAll(this.newLineReplacePattern, '\n');
    }

    static getVerbParam(regex: RegExp | string, command: string): Map<string, string | null> | null {
        var regExp = RegExp(regex);
        var regexMatches = this._getMatches(regExp, command);
        if (regexMatches.next().done) {
            return null;
        }
        var verbParams = this._processMatches(regexMatches);
        return verbParams;
    }
}