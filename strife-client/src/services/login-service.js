import * as cryptoService from './crypto-service.js';
import * as socketService from './socket-service.js';

export async function loginUser(currentUserData) {
  const loginResponse = await fetch(
    `${process.env.REACT_APP_AM_API_URL}/account/login`,
    {
      method: 'POST',
      body: JSON.stringify({
        username: currentUserData.username,
        password: currentUserData.password,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );
  return await loginResponse.json();
}

export async function checkLoggedIn() {
  const secureStorageKey = localStorage.getItem('secureStorageKey');
  if (secureStorageKey === null) {
    return { username: null };
  }
  const loggedInResponse = await fetch(
    `${process.env.REACT_APP_AM_API_URL}/account/logged_in`,
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

export async function logoutUser(socket) {
  const logoutResponse = await fetch(
    `${process.env.REACT_APP_AM_API_URL}/account/logout`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );
  const logoutResult = await logoutResponse.json();
  if (logoutResult.success) {
    socketService.disconnect(socket);
    localStorage.removeItem('secureStorageKey');
    return { success: true };
  } else return { success: false };
}
