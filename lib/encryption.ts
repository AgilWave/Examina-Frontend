import CryptoJS from 'crypto-js';

const key = CryptoJS.SHA256('examina');

export function encrypt(text: string): string {
    const iv = CryptoJS.lib.WordArray.random(16); 
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });

    return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString(); 
}

export function decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });

    return decrypted.toString(CryptoJS.enc.Utf8); 
}
