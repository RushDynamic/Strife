import fetch from 'node-fetch';

export async function generateAccessToken(username) {
  // TODO: Replace URLs with constants
  // TODO: Exception handling
  const generateAccessTokenResponse = await fetch(
    'http://localhost:3002/auth/generate/access',
    {
      method: 'POST',
      body: JSON.stringify({
        username: username,
      }),
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return await generateAccessTokenResponse.json();
}

export async function generateRefreshToken(username) {
  const generateRefreshTokenResponse = await fetch(
    'http://localhost:3002/auth/generate/refresh',
    {
      method: 'POST',
      body: JSON.stringify({
        username: username,
      }),
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return await generateRefreshTokenResponse.json();
}

export async function generateAll(name) {
  const generateAllResponse = await fetch(
    'http://ua-api:3002/auth/generate/all',
    {
      method: 'POST',
      body: JSON.stringify({
        username: name,
      }),
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return await generateAllResponse.json();
}

export async function validateAccessToken(accessToken) {
  const validateAccessTokenResponse = await fetch(
    'http://ua-api:3002/auth/verify/access',
    {
      method: 'POST',
      body: JSON.stringify({
        accessToken: accessToken,
      }),
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const validateAccessTokenData = await validateAccessTokenResponse.json();
  return validateAccessTokenData.success;
}

export async function validateRefreshToken(refreshToken) {
  const validateRefreshTokenResponse = await fetch(
    'http://ua-api:3002/auth/verify/refresh',
    {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return await validateRefreshTokenResponse.json();
}
