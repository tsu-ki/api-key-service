import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const SECRET = process.env.API_KEY_ENCRYPTION_SECRET;


export const generateRawKey = () =>
  `key_${crypto.randomBytes(24).toString('hex')}`;

export const encrypt = (plainText) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET, 'hex'), iv);
  const encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (encryptedText) => {
  const [ivHex, encHex] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  return decipher.update(encHex, 'hex', 'utf8') + decipher.final('utf8');
};
