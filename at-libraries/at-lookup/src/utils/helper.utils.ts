import { md, pki } from "node-forge";



export function toPrivatePem(key: string): pki.rsa.PrivateKey {
    return pki.privateKeyFromPem(`-----BEGIN RSA PRIVATE KEY-----${key}-----END RSA PRIVATE KEY-----`);
}

export function toPublicPem(key: string): pki.rsa.PublicKey {
    return pki.publicKeyFromPem(`-----BEGIN PUBLIC KEY-----${key}-----END PUBLIC KEY-----`);
}

export function signChallenge(privateKey: string, challenge: string): string {
    var _privateKey = toPrivatePem(privateKey);
    var _md = md.sha256.create();
    _md.update(challenge, 'utf8');
    var _sign = _privateKey.sign(_md);
    return Buffer.from(_sign, 'ascii').toString('base64');
}