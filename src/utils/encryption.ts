import crypto from 'crypto';
import config from '../config/config';

const DATA_ENCRYPTION_KEY = config.DATA_ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (DATA_ENCRYPTION_KEY?.length !== 32) {
    throw new Error('DATA_ENCRYPTION_KEY must be 32 characters long.');
}

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt
 * @returns Encrypted data in format iv:authTag:cipherText
 */
export const encrypt = (data: string): string => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(DATA_ENCRYPTION_KEY, 'utf8'),
        iv
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - Encrypted data in format iv:authTag:cipherText
 * @returns Decrypted data as string
 */
export const decrypt = (encryptedData: string): string => {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    if (!ivHex || !authTagHex || !encrypted) {
        throw new Error('Invalid encrypted data format.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(DATA_ENCRYPTION_KEY, 'utf8'),
        iv
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
