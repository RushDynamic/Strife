import * as cryptoService from './crypto-service.js';

export async function loginUser(currentUserData, setUser) {
  const loginResponse = await fetch('http://localhost:3001/account/login', {
    method: 'POST',
    body: JSON.stringify({
      username: currentUserData.username,
      password: currentUserData.password,
    }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return await loginResponse.json();
}

export async function checkLoggedIn() {
  const secureStorageKey = localStorage.getItem('secureStorageKey');
  if (secureStorageKey === null) {
    return { username: null };
  }
  const loggedInResponse = await fetch(
    'http://localhost:3001/account/logged_in',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );
  const loggedInData = await loggedInResponse.json();
  if (loggedInData.success === true) {
    const encodedKeyPair = JSON.parse(loggedInData.encodedKeyPair);
    const decryptedPrivateKey = cryptoService.decryptSymmetric(
      encodedKeyPair.privateKey.encryptedPrivateKey,
      secureStorageKey,
      true,
    );
    delete loggedInData.success;
    delete loggedInData.encodedKeyPair;
    return {
      ...loggedInData,
      publicKey: encodedKeyPair.publicKey,
      privateKey: decryptedPrivateKey,
    };
  }
  return { username: null };
}
