// This utility generates one-line PEM format Private and Public Keys
const crypto = require('crypto')

const generateKey = () => {
  crypto.generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  }, (err, publicKey, privateKey) => {
    // Handle errors and use the generated key pair.
    console.log('\n')
    const oneLinePrivateKey = privateKey.replace(/\r/g, '').replace(/\n/g, '\\n')
    console.log(oneLinePrivateKey)

    console.log('\n')
    const oneLinePublicKey = publicKey.replace(/\r/g, '').replace(/\n/g, '\\n')
    console.log(oneLinePublicKey)
  })
}

generateKey()
