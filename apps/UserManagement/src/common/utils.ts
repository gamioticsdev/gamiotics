import { hashSync } from 'bcrypt';
import crypto from 'crypto';
export const hashPassword = (password: string): string => {
  const nonce = crypto.randomBytes(16).toString('base64');
  return hashSync(password + nonce, 10);
};

export const generateNonce = (): string => crypto.randomBytes(16).toString('base64');
