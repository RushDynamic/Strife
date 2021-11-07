import nacl, { box, secretbox, randomBytes } from "tweetnacl";
import {
    decodeUTF8,
    encodeUTF8,
    encodeBase64,
    decodeBase64
} from "tweetnacl-util";

export function generateKeyPair() {
    return new nacl.box.keyPair();
}

export function encryptSymmetricWithNewKey(inputStr) {
    const keyBytes = randomBytes(secretbox.keyLength);
    const nonceBytes = generateNonce();
    const inputStrBytes = decodeBase64(inputStr);
    const encInputBytes = secretbox(inputStrBytes, nonceBytes, keyBytes);
    const encInputBytesWithNonce = new Uint8Array(nonceBytes.length + encInputBytes.length);
    encInputBytesWithNonce.set(nonceBytes);
    encInputBytesWithNonce.set(encInputBytes, nonceBytes.length);
    return { secureStoragekeyBase64: encodeBase64(keyBytes), encInputWithNonceBase64: encodeBase64(encInputBytesWithNonce) };
}

export function encryptSymmetric(inputStr, key) {
    const paddedKeyBytes = decodeUTF8(rightPadKey(key));
    const nonceBytes = generateNonce();
    const inputStrBytes = decodeBase64(inputStr);
    const encInputBytes = secretbox(inputStrBytes, nonceBytes, paddedKeyBytes);
    const encInputBytesWithNonce = new Uint8Array(nonceBytes.length + encInputBytes.length);
    encInputBytesWithNonce.set(nonceBytes);
    encInputBytesWithNonce.set(encInputBytes, nonceBytes.length);
    return encodeBase64(encInputBytesWithNonce);
}

export function decryptSymmetric(encInputBase64, key, isKeyInBase64) {
    const paddedKeyBytes = isKeyInBase64 ? decodeBase64(key) : decodeUTF8(rightPadKey(key));
    const encInputBytesWithNonce = decodeBase64(encInputBase64);
    const nonceBytes = encInputBytesWithNonce.slice(0, secretbox.nonceLength);
    const encInputBytes = encInputBytesWithNonce.slice(secretbox.nonceLength, encInputBase64.length);
    const decInputBytes = secretbox.open(encInputBytes, nonceBytes, paddedKeyBytes);
    if (!decInputBytes) {
        // TODO: handle private key decryption error
    }
    return encodeBase64(decInputBytes);
}

export function bytesToBase64(inputBytes) {
    return encodeBase64(inputBytes);
}

function generateNonce() {
    return randomBytes(secretbox.nonceLength);
}

function rightPadKey(key) {
    let paddedKey = key;
    while (paddedKey.length < secretbox.keyLength) {
        paddedKey += key;
    }
    return paddedKey.substring(0, secretbox.keyLength);
}