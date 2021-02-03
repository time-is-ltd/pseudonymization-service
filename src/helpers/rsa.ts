import * as crypto from 'crypto'
 
export const urlEncode = (toEncode: string): string => {
  return toEncode
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

export const urlDecode = (toDecode: string): string => {
  // Add removed at end '='
  toDecode += Array(5 - toDecode.length % 4).join('=');
  toDecode = toDecode
    .replace(/\-/g, '+') // Convert '-' to '+'
    .replace(/\_/g, '/'); // Convert '_' to '/'
  return toDecode
}

export const rsaEncrypt = (toEncrypt: string, publicKey: string): string => {
  
    const options = {
      key: publicKey,
      oaepHash: 'RSA-SHA512',
    }
      const buffer = Buffer.from(toEncrypt);
      const encrypted = crypto.publicEncrypt(options, buffer);
      return urlEncode(encrypted.toString("base64"))
  
};

export const rsaDecrypt = (toDecrypt: string, privateKey: string): string => {

    const decodedRsa = urlDecode(toDecrypt)

    const options = {
      key: privateKey,
      oaepHash: 'RSA-SHA512',
    }

    const buffer = Buffer.from(decodedRsa, "base64");
    const decrypted = crypto.privateDecrypt(options , buffer);
    return decrypted.toString("utf8");
};

export const decryptEmail = (toDecrypt: string, privateKey: string): string => {

  if(!privateKey) return toDecrypt

    const contentRSA = toDecrypt.match(/(RSA_ENCRYPTED_EMAIL_([^/]*))/)
    
    if (contentRSA === null && contentRSA.length === 3) {
        // no encrypted content found
        return toDecrypt
    } else {
        return toDecrypt.replace(contentRSA[1], rsaDecrypt(contentRSA[2], privateKey))
    }
};

export default {
  decryptEmail,
}