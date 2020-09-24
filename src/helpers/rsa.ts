
import * as crypto from 'crypto'
import * as path from 'path'
import * as fs from 'fs'

// TODO:
  // Catch crash if privateKey is missing
  // Catch the crash if decoding doesn't work with the given key
  // Add the RSA functionality to the documentation


export const url_encode = (toEncode: string): string => {
  return toEncode
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

export const url_decode = (toDecode: string): string => {
  // Add removed at end '='
  toDecode += Array(5 - toDecode.length % 4).join('=');
  toDecode = toDecode
    .replace(/\-/g, '+') // Convert '-' to '+'
    .replace(/\_/g, '/'); // Convert '_' to '/'
  return toDecode
}

export const rsa_encrypt = (toEncrypt: string, publicKey: string): string => {
    
  const options = {
    key: publicKey,
    oaepHash: 'RSA-SHA512', 
  }
    let buffer = Buffer.from(toEncrypt);
    let encrypted = crypto.publicEncrypt(options, buffer);
    return encrypted.toString("base64");
};

export const rsa_decrypt = (toDecrypt: string, privateKey: string): string => {

    let decodedRsa = url_decode(toDecrypt)

    const options = {
      key: privateKey,
      oaepHash: 'RSA-SHA512', 
    }

    let buffer = Buffer.from(decodedRsa, "base64");
    let decrypted = crypto.privateDecrypt(options , buffer);
    return decrypted.toString("utf8");
};

export const findAndDecryptRSA = (toDecrypt: string, privateKey: string): string => {

    const findRSA = new RegExp(`[^/]{100,5000}`, 'gi') // TODO: Improve this matching
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