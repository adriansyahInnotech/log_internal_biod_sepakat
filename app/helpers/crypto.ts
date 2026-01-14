import crypto from 'crypto';

export function decryptLogInternalAES(base64CipherText: string) {
  // Decode base64 ciphertext
  const keyString = process.env.SECRET_KEY_LOG_INTERNAL;
  if (!keyString) {
    throw new Error('SECRET_KEY_LOG_INTERNAL is not defined');
  }
  const key = Buffer.from(keyString, 'utf8');
  if (![16, 24, 32].includes(key.length)) {
    throw new Error('invalid key size, must be 16, 24, or 32 bytes');
  }
  const raw = Buffer.from(base64CipherText, 'base64');
  if (raw.length < 16) {
    throw new Error('ciphertext too short');
  }
  const iv = raw.subarray(0, 16);
  const cipherText = raw.subarray(16);
  const algo = `aes-${key.length * 8}-cbc`;
  const decipher = crypto.createDecipheriv(algo, key, iv);
  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return decrypted.toString('utf8');
}

