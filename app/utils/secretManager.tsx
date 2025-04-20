import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = process.env.SECRETS_HASH_KEY || '';
const IV_LENGTH = 16;

export function encryptSecret(text: string): string {
  if (!text) return '';
  
  try {
    // Create a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher with key and iv
    const key = crypto.createHash('sha256').update(KEY).digest('base64').slice(0, 32);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return iv + encrypted (iv needed for decryption)
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptSecret(encryptedText: string): string {
  if (!encryptedText) return '';
  
  try {
    // Split iv and encrypted text
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) return '';

    // Convert iv from hex to Buffer
    const iv = Buffer.from(ivHex, 'hex');
    
    // Create decipher with key and iv
    const key = crypto.createHash('sha256').update(KEY).digest('base64').slice(0, 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}