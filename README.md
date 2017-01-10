# asymmetric-crypto

[![Build Status](https://img.shields.io/travis/queicherius/asymmetric-crypto.svg?style=flat-square)](https://travis-ci.org/queicherius/asymmetric-crypto)
[![Coverage Status](https://img.shields.io/codecov/c/github/queicherius/asymmetric-crypto/master.svg?style=flat-square)](https://codecov.io/github/queicherius/asymmetric-crypto)

> Encryption and signing using public-key cryptography (via [`tweetnacl`](https://github.com/dchest/tweetnacl-js))

## Install

```
npm install asymmetric-crypto
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

```js
import * as crypto from 'asymmetric-crypto'

// Generate a key pair
const keyPair = crypto.keyPair()
// -> {
//   secretKey: 'KOy7fMWMkRc+QX8dzpfX9VwJKlc/+Zkyw5C7RGTXT920IjiKUdOSe/3sNnrETw7ej9TBFzsPyRfkWGMsGLAufQ==',
//   publicKey: 'tCI4ilHTknv97DZ6xE8O3o/UwRc7D8kX5FhjLBiwLn0='
// }

// Regenerate a key pair from the secret key
const newKeyPair = crypto.fromSecretKey(keyPair.secretKey)
// -> {
//   secretKey: 'KOy7fMWMkRc+QX8dzpfX9VwJKlc/+Zkyw5C7RGTXT920IjiKUdOSe/3sNnrETw7ej9TBFzsPyRfkWGMsGLAufQ==',
//   publicKey: 'tCI4ilHTknv97DZ6xE8O3o/UwRc7D8kX5FhjLBiwLn0='
// }

const myKeyPair = crypto.keyPair()
const theirKeyPair = crypto.keyPair()

// Encrypt data
const encrypted = crypto.encrypt('some data', theirKeyPair.publicKey, myKeyPair.secretKey)
// -> {
//   data: '63tP2r8WQuJ+k+jzsd8pbT6WYPHMTafpeg==',
//   nonce: 'BDHALdoeBiGg7wJbVdfJhVQQyvpxrBSo'
// }

// Decrypt data
const decrypted = crypto.decrypt(encrypted.data, encrypted.nonce, myKeyPair.publicKey, theirKeyPair.secretKey)
// -> 'some data'

// Sign a message
const message = 'some message'
const signature = crypto.sign(message, myKeyPair.secretKey)
// -> '8oz1aNkSBG1qvYhc+E2VBkgHSxCORGdsyf7LFQuLDmZvJt6vaEzHMIsofmTykMunhCrChEHT9Fgw3sp/W6+7Bw=='

// Verify the signature on a message
const validSignature = crypto.verify(message, signature, myKeyPair.publicKey)
// -> true
```

## Tests

```
npm test
```

## Internals

- [`tweetnacl`](https://github.com/dchest/tweetnacl-js) for the cryptographic implementation
- [`tweetnacl-util`](https://github.com/dchest/tweetnacl-util-js) for converting into / from strings
- [`ed2curve`](https://github.com/dchest/ed2curve-js) for converting *Ed25519* keys into *curve25519-xsalsa20-poly1305* keys (so you can encrypt and sign with the same key pair)
- [`fast-memoize`](https://www.npmjs.com/package/fast-memoize) to make converting keys more efficient

## Licence

MIT

---

Thanks to @pguth for the inspiration. :smile:
