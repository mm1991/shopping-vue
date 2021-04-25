import JsEncrypt from 'jsencrypt';

const jsEncrypt = JsEncrypt;

const publicJwk = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4zFu9jGEQB24zsPJASoRzHShL
GVmXDoVWetLZenjcjKUbJ0QMl70fjv3mfMmHowOvHxF0VRoTvbaJQEJcT9UPrMWE
OLrT4TTTd6IAq7ObnsWjL9rZVBul+yzIkxhdL5d+dA33fAA8YHINjO497FoBeKy4
1HjxsNxE2Q0npv/MRQIDAQAB
-----END PUBLIC KEY-----`;

export function rsaEncrypt(password) {
    let jse = new jsEncrypt();
    jse.setPublicKey(publicJwk);
    return jse.encrypt(password);
}