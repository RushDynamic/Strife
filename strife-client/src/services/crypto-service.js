export async function generateKeyPair() {
    return await window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, true, ["encrypt", "decrypt"]);
}

export async function exportRawKey(keyObj) {
    const rawKey = await window.crypto.subtle.exportKey("jwk", keyObj);
    return JSON.stringify(rawKey);
}

export function encryptPrivateKey(privateKey, password) {
    // encrypt private key with user's login password
    // store iv and encrypted privatekey in local storage
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const encodedPrivateKey = new TextEncoder().encode(privateKey);
}

export function importPrivateKey(password) {
    // retrieve private key from local storage
    // decrypt using user's login password
    // store in context/redux state
}