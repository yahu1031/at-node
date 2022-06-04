import { createHash } from 'crypto';
import { AtLogger } from '../logger/atlogger';
import './ext-helper';
import { TextEncoder } from 'text-encoding';

/**
 * Utility class for atSign operations
 */
export class AtSignUtil {
    private static _instance: AtSignUtil = new AtSignUtil();

    private _logger = new AtLogger('AtSignUtil');

    /**
     * Creates an instance of at metadata util.
     */
    private constructor() {
        if (AtSignUtil._instance) {
            throw this._logger.error("Error: Instantiation failed: Use AtSignUtil.getInstance() instead of new.");
        }
        AtSignUtil._instance = this;
    }

    /**
     * Gets instance
     * @returns singletone instance 
     */
    public static getInstance(): AtSignUtil {
        return AtSignUtil._instance;
    }


    /**
     * Apply all the rules on the provided atSign and return fixedAtSign
     */
    public fixAtSign(atSign: string): string | undefined {
        // @signs are always lowercase Latin
        if (atSign == '') {
            this._logger.error(AtMessage.noAtSign.toString());
            return;
        }
        atSign = atSign.toLowerCase();
        if (!atSign.includes('@')) {
            this._logger.error(AtMessage.noAtSign.toString());
            return;
        }
        // @signs can only have one @ character in them
        var noAT = atSign.replace('@', '');
        if (RegExp('@').test(noAT)) {
            this._logger.error(AtMessage.moreThanOneAt.toString());
            return;
        }
        // The dot "." can be used in an @sign but it is removed so @colinconstable is the same as @colin.constable
        // As is home.phone@colin stays home.phone@colin
        // but home.phone@colin.constable gets translated to home.phone@colinconstable
        // This is for clarity for humans
        var split = atSign.split('@');
        var left = split[0]!.toString();
        var right = split[1]!.toString();
        right = right.replaceAll('.', '');
        if (right.isEmpty()) {
            this._logger.error(AtMessage.noAtSign.toString());
            return;
        }
        // reconstruct @sign
        atSign = left + '@' + right;
        // Some Characters are reserved
        // If found the @sign should be rejected
        if (RegExp("[\!\*\'`\(\)\;\:\&\=\+\$\,\/\?\#\[\]\{\}]").test(atSign)) {
            this._logger.error(AtMessage.reservedCharacterUsed.toString());
            return;
        }
        // White spaces are not allowed in @signs
        // If found the @sign should be rejected
        // SPACE,TAB,LINEFEED etc
        // Ref https://en.wikipedia.org/wiki/Whitespace_character
        if (RegExp(
            '[\u0020\u0009\u000A\u000B\u000C\u000D\u0085\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000]').test(atSign)) {
            this._logger.error(AtMessage.whiteSpaceNotAllowed.toString());
            return;
        }
        // ASCII control Characters are not allowed in @signs!
        if (RegExp('[\u0000-\u001F\u007F]').test(atSign)) {
            this._logger.error(AtMessage.controlCharacter.toString());
            return;
        }
        // Unicode control Characters are not allowed in @signs
        if (RegExp('[\u2400-\u241F\u2400\u2421\u2424\u2425]').test(atSign)) {
            this._logger.error(AtMessage.controlCharacter.toString());
            return;
        }
        return atSign;
    }

    /**
     * Return AtSign by appending '@' at the beginning if not present
     */
    public formatAtSign(atSign?: string): string | undefined {
        // verify whether atSign started with '@' or not
        if ((atSign != null && atSign.isNotEmpty()) && !atSign.startsWith('@')) {
            atSign = `@${atSign}`;
        }
        return atSign;
    }

    /**
     * Gets sha for atSign
     * @param atsign 
     * @returns sha for at sign 
     */
    public getShaForAtSign(atsign: string): string {
        const bytes = new TextEncoder().encode(atsign);
        return createHash('sha256').update(bytes).digest('hex');
    }

}

enum AtMessage {
    notFoundMsg = 'No message found',
    wrongVerbMsg =
    'Available verbs are: lookup:, from:, pol:, llookup:, plookup:, update:, delete:, scan and exit. ',
    closingConnectionMsg = 'Closing the connection. ',
    cleanExitMsg = 'Exited cleanly, closing the connection. ',
    moreThanOneAt =
    'invalid @sign: Cannot Contain more than one @ character',
    whiteSpaceNotAllowed =
    'invalid @sign: Cannot Contain whitespace characters',
    reservedCharacterUsed =
    'invalid @sign: Cannot contain !*\'\\"`();:&=+$,/?#[]{} characters',
    noAtSign =
    'invalid @sign: must include one @ character and at least one character on the right',
    controlCharacter =
    'invalid @sign: must not include control characters',
}