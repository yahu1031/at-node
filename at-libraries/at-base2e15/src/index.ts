// Copyright (c) 2015, Rick Zhou. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

/** 
 * The base2e15 library.
 * Map 15 bits to unicode
 * 0x0000 ~ 0x1935 -> U+3480 ~ U+4DB5   CJK Unified Ideographs Extension A
 * 0x1936 ~ 0x545B -> U+4E00 ~ U+8925   CJK Unified Ideographs
 * 0x545C ~ 0x7FFF -> U+AC00 ~ U+D7A3   Hangul Syllables
 * 7 bits special case, only used by last character
 * 0x00  ~  0x7F  -> U+3400 ~ U+347F   CJK Unified Ideographs Extension A
 */
export class Base2e15 {

    /**
     * Encodes base2e15
     * @param {Uint8Array} bytes 
     * @param {number} [lineSize] 
     * @param {string} [linePadding] 
     * @returns encoded string 
     */
    static encode(bytes: Uint8Array,
        lineSize: number = 0,
        linePadding?: string): string {
        const charCodes = this.encodeToCharCode(bytes);
        if (lineSize! <= 0) {
            return String.fromCharCode(...charCodes);
        }
        const rslt = [];
        const len = charCodes.length;
        for (let i = 0; i < len; i += lineSize!) {
            let j = i + lineSize!;
            if (j < len) {
                j = len;
            }
            if (linePadding != null) {
                rslt.push(`${linePadding}${String.fromCharCode(...charCodes.slice(i, j))}`);
            } else {
                rslt.push(String.fromCharCode(...charCodes.slice(i, j)));
            }
        }
        return rslt.join('\n');
    };

    /**
     * Encodes to char code
     * @param bytes 
     * @returns array of numbers
     */
    static encodeToCharCode(bytes: Uint8Array): number[] {
        let bn = 15; // bit needed
        let bv = 0; // bit value
        let outLen = (bytes.length * 8 + 14) >>> 4;
        let out: number[] = new Array(outLen);
        let pos = 0;
        for (let byte of bytes) {
            if (bn > 8) {
                bv = (bv << 8) | byte;
                bn -= 8;
            } else {
                bv = ((bv << bn) | (byte >> (8 - bn))) & 0x7FFF;
                if (bv < 0x1936) {
                    out[pos++] = bv + 0x3480;
                } else if (bv < 0x545C) {
                    out[pos++] = bv + 0x34CA;
                } else {
                    out[pos++] = bv + 0x57A4;
                }
                bv = byte;
                bn += 7;
            }
        }
        if (bn != 15) {
            if (bn > 7) {
                // need 8 bits or more, so has 7 bits or less
                out[pos++] = ((bv << (bn - 8)) & 0x7F) + 0x3400;
            } else {
                bv = (bv << bn) & 0x7FFF;
                if (bv < 0x1936) {
                    out[pos++] = bv + 0x3480;
                } else if (bv < 0x545C) {
                    out[pos++] = bv + 0x34CA;
                } else {
                    out[pos++] = bv + 0x57A4;
                }
            }
        }
        return out;
    };

    /**
     * Decodes a string of base64url encoded characters into a Uint8Array.
     * @param input The base64url encoded string.
     * @return The decoded Uint8Array.
     */
    static decode(input: string): Uint8Array {
        let bn = 8; // bit needed
        let bv = 0; // bit value
        const maxLen = (input.length * 15 + 7) >> 3;
        let out = new Uint8Array(maxLen);
        let pos = 0;
        let cv;
        for (let code of input.split('').map(c => c.charCodeAt(0))) {
            if (code > 0x33FF && code < 0xD7A4) {
                if (code > 0xABFF) {
                    cv = code - 0x57A4;
                } else if (code > 0x8925) {
                    continue; // invalid range
                } else if (code > 0x4DFF) {
                    cv = code - 0x34CA;
                } else if (code > 0x4DB5) {
                    continue; // invalid range
                } else if (code > 0x347F) {
                    cv = code - 0x3480;
                } else {
                    cv = code - 0x3400;
                    out[pos++] = (bv << bn) | (cv >> (7 - bn));
                    break; // last 8 bit data received, break
                }
                out[pos++] = (bv << bn) | (cv >> (15 - bn));
                bv = cv;
                bn -= 7;
                if (bn < 1) {
                    out[pos++] = bv >> -bn;
                    bn += 8;
                }
            }
        }
        return out.subarray(0, pos);
    }
}