import jwt from 'jsonwebtoken';

// token create
export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string | number, // Accept both string (e.g., '1h') or number (in seconds)
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'], // Cast to ensure compatibility
  });
};

// check current email
export let currentUserEmail: string | null = null;

// login user email
export const loginUserEmail = (email: string) => {
  currentUserEmail = email;
};
