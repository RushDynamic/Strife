import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../services/auth-service.js';

export function handleGenerateAccessToken(req, res) {
  if (req.body.username == null || req.body.username == '')
    return res.status(500).json({
      success: false,
    });
  const accessToken = generateAccessToken(req.body.username);
  if (accessToken == null)
    return res.status(500).json({
      success: false,
    });
  return res.status(200).json({
    success: true,
    accessToken: accessToken,
  });
}

export async function handleGenerateRefreshToken(req, res) {
  if (req.body.username == null || req.body.username == '')
    return res.status(500).json({
      success: false,
    });
  const authToken = await generateRefreshToken(req.body.username);
  if (authToken.refreshToken == null)
    return res.status(500).json({
      success: false,
    });
  return res.status(200).json({
    success: true,
    refreshToken: authToken.refreshToken,
  });
}

export async function handleGenerateAll(req, res) {
  if (req.body.username == null || req.body.username == '')
    return res.status(500).json({
      success: false,
    });
  const accessToken = generateAccessToken(req.body.username);
  const authToken = await generateRefreshToken(req.body.username);
  if (authToken.refreshToken == null || accessToken == null)
    return res.status(500).json({
      success: false,
    });
  return res.status(200).json({
    success: true,
    accessToken: accessToken,
    refreshToken: authToken.refreshToken,
  });
}

export function handleVerifyAccessToken(req, res) {
  if (verifyAccessToken(req.body.accessToken)) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(401).json({
      success: false,
    });
  }
}

export async function handleVerifyRefreshToken(req, res) {
  const verificationResult = await verifyRefreshToken(req.body.refreshToken);
  console.log(
    'handleVerifyRefreshToken().verificationResult: ',
    verificationResult,
  );
  if (verificationResult.success) {
    res.status(200).json({
      success: true,
      refreshToken: req.body.refreshToken,
      username: verificationResult.username,
    });
  } else {
    res.status(401).json({
      success: false,
    });
  }
}
