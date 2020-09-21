
import * as crypto from 'crypto'
import * as path from 'path'
import * as fs from 'fs'

export const generateKey = () => {

    crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        }
      }, (err, publicKey, privateKey) => {
        // Handle errors and use the generated key pair.
        
        privateKey = privateKey.replace(/\r/g, '').replace(/\n/g, '\\n');
        console.log(privateKey)

        publicKey = publicKey.replace(/\r/g, '').replace(/\n/g, '\\n');
        console.log(publicKey)

      });
}

export const rsa_encrypt = (toEncrypt: string, publicKey: string): string => {
    
    let buffer = Buffer.from(toEncrypt);
    let encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

export const rsa_decrypt = (toDecrypt: string, privateKey: string): string => {
    
    generateKey()
    console.log(privateKey)
    console.log(toDecrypt)

    const options = {
		key: privateKey,
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
	}

    let buffer = Buffer.from(toDecrypt, "base64");
    let decrypted = crypto.privateDecrypt(options , buffer);
    return decrypted.toString("utf8");
};

export const findAndDecryptRSA = (toDecrypt: string, privateKey: string): string => {

    const findRSA = new RegExp(`[^/]{100,2000}`, 'gi') // Improve this matching
    const contentRSA = toDecrypt.match(findRSA)
    
    if (contentRSA == null) {
        // no encrypted content found
        return toDecrypt
    } else {
        return toDecrypt.replace(new RegExp(`[^/]{100,2000}`, 'gi'), rsa_decrypt(contentRSA[0], privateKey))
    }
};

export default {
    findAndDecryptRSA
}