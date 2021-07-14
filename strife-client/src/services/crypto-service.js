import { secretbox, box, randomBytes } from 'tweetnacl';
import * as base64 from "byte-base64";

export function generateKeyPair() {
    return box.keyPair();
}

export function encryptPrivateKey(privateKey, password) {
    const newNonce = randomBytes(secretbox.nonceLength);
    var passwordUint8Array = new TextEncoder().encode(password);
    if (passwordUint8Array.length < secretbox.keyLength) {
        addPadding(passwordUint8Array);
        passwordUint8Array = addPadding(passwordUint8Array);
        console.log("Performed padding for password");
    }
    const encryptedPvtKey = secretbox(privateKey, newNonce, passwordUint8Array);
    const encryptedPvtKeyWithNonceBase64 = `${base64.bytesToBase64(newNonce)}||${base64.bytesToBase64(encryptedPvtKey)}`;
    return encryptedPvtKeyWithNonceBase64;
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