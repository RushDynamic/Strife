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
    else {
        key = base64.base64ToBytes(key);
    }
    const encryptedBytes = secretbox(rawBytes, nonce, key);
    return {
        encryptedDataWithNonceBase64: `${base64.bytesToBase64(nonce)}||${base64.bytesToBase64(encryptedBytes)}`,
        localStorageKeyBase64: base64.bytesToBase64(key)
    };
}

export function decryptData(rawString, key) {
    const nonce = base64.base64ToBytes(rawString.split('||')[0]);
    const encryptedBytes = base64.base64ToBytes(rawString.split('||')[1]);
    const decryptedBytes = secretbox.open(encryptedBytes, nonce, base64.base64ToBytes(key));
    console.log("decryptedBytes:", decryptedBytes);
    return base64.bytesToBase64(decryptedBytes);
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
    const nonce = randomBytes(box.nonceLength);
    const encryptedMsg = box(new TextEncoder().encode(message), nonce, base64.base64ToBytes(publicKey), base64.base64ToBytes(privateKey));
    const encryptedMsgWithNonceBase64 = `${base64.bytesToBase64(nonce)}||${base64.bytesToBase64(encryptedMsg)}`
    console.log("EncryptedMessage:", encryptedMsgWithNonceBase64);
    return encryptedMsgWithNonceBase64;
}

export function decryptMessage(encryptedMessageWithNonce, publicKey, privateKey) {
    const nonce = encryptedMessageWithNonce.split('||')[0];
    const encryptedMessage = encryptedMessageWithNonce.split('||')[1];
    const decryptedMessage = box.open(base64.base64ToBytes(encryptedMessage), base64.base64ToBytes(nonce), base64.base64ToBytes(publicKey), base64.base64ToBytes(privateKey))
    return new TextDecoder().decode(decryptedMessage);
}

export function generateSymmetricKey() {
    return base64.bytesToBase64(randomBytes(secretbox.keyLength));
}