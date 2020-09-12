
import * as crypto from 'crypto'
import * as path from 'path'
import * as fs from 'fs'

export const rsa_encrypt = (toEncrypt: string, publicKey: string): string => {
    
    let buffer = Buffer.from(toEncrypt);
    let encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

export const rsa_decrypt = (toDecrypt: string, privateKey: string): string => {
    

    // TODO by default it's using SHA1, how to change it?, zkusit nacist ze souboru
    const options = { key: privateKey, oaepHash:'sha256'}

    
    let buffer = Buffer.from(toDecrypt, "base64");
    let decrypted = crypto.privateDecrypt(options , buffer);
    return decrypted.toString("utf8");
};

export const findAndDecryptRSA = (toDecrypt: string, privateKey: string): string => {

    const findRSA = new RegExp(`[^/]{100,2000}`, 'gi')
    const contentRSA = toDecrypt.match(findRSA)
    
    if (contentRSA == null) {
        return toDecrypt
    } else {
        return toDecrypt.replace(new RegExp(`[^/]{100,2000}`, 'gi'), rsa_decrypt(contentRSA[0], privateKey))
    }
};

export default {
    findAndDecryptRSA
}