export async function loginUser(currentUserData, localStorageKey) {
    const loginResponse = await fetch("http://localhost:3001/account/login", {
        method: 'POST',
        body: JSON.stringify({
            username: currentUserData.username,
            password: currentUserData.password,
            localStorageKey: localStorageKey
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    return await loginResponse.json();
}

export async function checkLoggedIn() {
    const containsPvtKey = localStorage.getItem('nonce_pvt_key') === null ? false : true;
    const loggedInResponse = await fetch("http://localhost:3001/account/logged_in", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const loggedInData = await loggedInResponse.json();
    if (loggedInData.success == true && containsPvtKey) {
        return ({
            username: loggedInData.username,
            avatar: loggedInData.avatar,
            accessToken: loggedInData.accessToken,
            localStorageKey: loggedInData.localStorageKey,
            publicKey: loggedInData.publicKey,
            encryptedPvtKey: localStorage.getItem('nonce_pvt_key')
        });
    }
    return ({ username: null });
}