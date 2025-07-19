import Tokens from 'csrf';
const tokens = new Tokens();

const generateToken = (req, res, next) => {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  
  // Store the secret in the session or database
  req.csrfSecret = secret;
  
  // Set the token in a cookie
  res.cookie('csrfToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict'
  });
  
  next();
}
const verifyToken = (req, res, next) => {
  const token = req.cookies.csrfToken;
  const secret = req.csrfSecret;

  if (!token || !secret) {
    return res.status(403).json({ message: 'CSRF token missing or invalid' });
  }

  if (!tokens.verify(secret, token)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
}
export { generateToken, verifyToken };