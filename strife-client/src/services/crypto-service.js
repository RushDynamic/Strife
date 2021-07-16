import { secretbox, box, randomBytes } from 'tweetnacl';
import * as base64 from "byte-base64";

export function generateKeyPair() {
    return box.keyPair();
}

export function encryptPrivateKey(privateKey) {
    const newNonce = randomBytes(secretbox.nonceLength);
    const key = randomBytes(secretbox.keyLength);
    const encryptedPvtKey = secretbox(privateKey, newNonce, key);
    return {
        encryptedPvtKeyWithNonceBase64: `${base64.bytesToBase64(newNonce)}||${base64.bytesToBase64(encryptedPvtKey)}`,
        accessStr: base64.bytesToBase64(key)
    };
}

export function decryptPrivateKey(encryptedPvtKeyWithNonce, accessStr) {
    const nonce = encryptedPvtKeyWithNonce.split('||')[0];
    const encryptedPvtKey = encryptedPvtKeyWithNonce.split('||')[1];
    const decryptedPvtKey = secretbox.open(base64.base64ToBytes(encryptedPvtKey), base64.base64ToBytes(nonce), base64.base64ToBytes(accessStr));
    return base64.bytesToBase64(decryptedPvtKey);
}

export function returnEncodedPublicKey(publicKey) {
    return base64.bytesToBase64(publicKey);
}

function addPadding(passwordUint8Array) {
    const paddingLength = secretbox.keyLength - passwordUint8Array.length;
    var paddingArray = new Uint8Array(paddingLength);
    for (let i = 0; i < paddingLength; i++) {
        paddingArray[i] = passwordUint8Array[i % passwordUint8Array.length];
    }
    var paddedPasswordArray = new Uint8Array(secretbox.keyLength);
    paddedPasswordArray.set(passwordUint8Array);
    paddedPasswordArray.set(paddingArray, passwordUint8Array.length);

    return paddedPasswordArray;
}