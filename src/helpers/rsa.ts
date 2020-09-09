
import * as crypto from 'crypto'
import * as path from 'path'
import * as fs from 'fs'

export const rsa_encrypt = (toEncrypt: string, publicKey: string): string => {
    
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

export const rsa_decrypt = (toDecrypt: string, privateKey: string): string => {

    var buffer = Buffer.from(toDecrypt, "base64");
    var decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
};

export default {
    rsa_decrypt,
    rsa_encrypt
}