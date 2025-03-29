import CryptoJS from 'crypto-js';

// Generate a 32-byte key using SHA256
const key = CryptoJS.SHA256('examina');

export function encrypt(text: string): string {
    const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });

    return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString(); // Store IV with encrypted text
}

export function decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');

    const iv = CryptoJS.enc.Hex.parse(ivHex); // Convert IV back to binary format
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });

    return decrypted.toString(CryptoJS.enc.Utf8); // Convert back to readable text
}
