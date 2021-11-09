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
    const nonceBytes = generateNonce("secretbox");
    const inputStrBytes = decodeBase64(inputStr);
    const encInputBytes = secretbox(inputStrBytes, nonceBytes, keyBytes);
    const encInputBytesWithNonce = new Uint8Array(nonceBytes.length + encInputBytes.length);
    encInputBytesWithNonce.set(nonceBytes);
    encInputBytesWithNonce.set(encInputBytes, nonceBytes.length);
    return { secureStoragekeyBase64: encodeBase64(keyBytes), encInputWithNonceBase64: encodeBase64(encInputBytesWithNonce) };
}

export function encryptSymmetric(inputStr, key) {
    const paddedKeyBytes = decodeUTF8(rightPadKey(key));
    const nonceBytes = generateNonce("secretbox");
    const inputStrBytes = decodeBase64(inputStr);
    const encInputBytes = secretbox(inputStrBytes, nonceBytes, paddedKeyBytes);
    const encInputBytesWithNonce = new Uint8Array(nonceBytes.length + encInputBytes.length);
    encInputBytesWithNonce.set(nonceBytes);
    encInputBytesWithNonce.set(encInputBytes, nonceBytes.length);
    return encodeBase64(encInputBytesWithNonce);
}

export function encryptAsymmetric(inputStr, publicKey, privateKey) {
    const publicKeyUint8 = decodeBase64(publicKey);
    const privateKeyUint8 = decodeBase64(privateKey);
    const inputUint8 = decodeUTF8(inputStr);
    const nonceUint8 = generateNonce("box");
    const encInputUint8 = box(inputUint8, nonceUint8, publicKeyUint8, privateKeyUint8);
    const encInputWithNonceUint8 = new Uint8Array(nonceUint8.length + encInputUint8.length);
    encInputWithNonceUint8.set(nonceUint8);
    encInputWithNonceUint8.set(encInputUint8, nonceUint8.length);
    return encodeBase64(encInputWithNonceUint8);
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

export function decryptAsymmetric(encInputBase64, privateKey, publicKey) {
    const encInputWithNonceUint8 = decodeBase64(encInputBase64);
    const nonceUint8 = encInputWithNonceUint8.slice(0, box.nonceLength);
    const encInputUint8 = encInputWithNonceUint8.slice(box.nonceLength, encInputWithNonceUint8.length);
    const decMsgUint8 = box.open(encInputUint8, nonceUint8, decodeBase64(publicKey), decodeBase64(privateKey));
    return encodeUTF8(decMsgUint8);
}

export function bytesToBase64(inputBytes) {
    return encodeBase64(inputBytes);
}

function generateNonce(boxType) {
    if (boxType === "secretbox") return randomBytes(secretbox.nonceLength);
    return randomBytes(box.nonceLength);
}

function rightPadKey(key) {
    let paddedKey = key;
    while (paddedKey.length < secretbox.keyLength) {
        paddedKey += key;
    }
    return paddedKey.substring(0, secretbox.keyLength);
}