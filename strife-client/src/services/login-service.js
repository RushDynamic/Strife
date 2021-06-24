export async function loginUser(currentUserData, setUser) {
    const loginResponse = await fetch("http://localhost:3001/account/login", {
        method: 'POST',
        body: JSON.stringify({
            username: currentUserData.username,
            password: currentUserData.password
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    return await loginResponse.json();
}

export async function checkLoggedIn() {
    const loggedInResponse = await fetch("http://localhost:3001/account/logged_in", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    const loggedInData = await loggedInResponse.json();
    if (loggedInData.success == true) {
        return ({ username: loggedInData.username, accessToken: loggedInData.accessToken });
    }
    return ({ username: null });
}