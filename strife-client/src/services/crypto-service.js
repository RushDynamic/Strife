import { secretbox, box, randomBytes } from 'tweetnacl';
import * as base64 from "byte-base64";

export function generateKeyPair() {
    return box.keyPair();
}

export function encryptData(rawBytes, key) {
    const nonce = randomBytes(secretbox.nonceLength);
    if (key == null || key == undefined) {
        key = randomBytes(secretbox.keyLength);
    }
    const encryptedBytes = secretbox(rawBytes, nonce, key);
    return {
        encryptedDataWithNonceBase64: `${base64.bytesToBase64(nonce)}||${base64.bytesToBase64(encryptedBytes)}`,
        localStorageKeyBase64: base64.bytesToBase64(key)
    };
}

export function decryptPrivateKey(encryptedPvtKeyWithNonce, accessStr) {
    const nonce = encryptedPvtKeyWithNonce.split('||')[0];
    const encryptedPvtKey = encryptedPvtKeyWithNonce.split('||')[1];
    const decryptedPvtKey = secretbox.open(base64.base64ToBytes(encryptedPvtKey), base64.base64ToBytes(nonce), base64.base64ToBytes(accessStr));
    return base64.bytesToBase64(decryptedPvtKey);
}

export function returnEncodedKey(key) {
    return base64.bytesToBase64(key);
}

export function encryptMessage(message, publicKey, privateKey) {
    const nonce = randomBytes(secretbox.nonceLength);
    const encryptedMsg = box(new TextEncoder().encode(message), nonce, base64.base64ToBytes(publicKey), base64.base64ToBytes(privateKey));
    const encryptedMsgWithNonceBase64 = `${base64.bytesToBase64(nonce)}||${base64.bytesToBase64(encryptedMsg)}`
    console.log("EncryptedMessage:", encryptedMsgWithNonceBase64);
    return encryptedMsgWithNonceBase64;
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