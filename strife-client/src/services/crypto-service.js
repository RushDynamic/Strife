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

export function encryptSymmetric(inputStr, key) {
    const paddedKeyBytes = decodeUTF8(rightPadKey(key));
    const nonceBytes = generateNonce();
    const inputStrBytes = decodeUTF8(inputStr);
    const encInputBytes = secretbox(inputStrBytes, nonceBytes, paddedKeyBytes);
    const encInputBytesWithNonce = new Uint8Array(nonceBytes.length + encInputBytes.length);
    encInputBytesWithNonce.set(nonceBytes);
    encInputBytesWithNonce.set(encInputBytes, nonceBytes.length);
    return encodeBase64(encInputBytesWithNonce);
}

export function decryptSymmetric(encInputBase64, key) {
    const paddedKeyBytes = decodeUTF8(rightPadKey(key));
    const encInputBytesWithNonce = decodeBase64(encInputBase64);
    const nonceBytes = encInputBytesWithNonce.slice(0, secretbox.nonceLength);
    const encInputBytes = encInputBytesWithNonce.slice(secretbox.nonceLength, encInputBase64.length);
    const decInputBytes = secretbox.open(encInputBytes, nonceBytes, paddedKeyBytes);
    if (!decInputBytes) {
        console.log("Error while decrypting");
    }
    return encodeUTF8(decInputBytes);
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