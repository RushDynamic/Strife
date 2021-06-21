import fetch from 'node-fetch';

export async function generateAccessToken(username) {
    const GenerateAccessTokenResponse = await fetch('http://localhost:3002/auth/generate/access', {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    });

    return await GenerateAccessTokenResponse.json();
}