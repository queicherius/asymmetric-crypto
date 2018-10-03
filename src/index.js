const nacl = require('tweetnacl')
const naclUtil = require('tweetnacl-util')
const ed2curve = require('ed2curve')
const memoize = require('fast-memoize')

const convert = {
  publicKey: memoize(ed2curve.convertPublicKey),
  secretKey: memoize(ed2curve.convertSecretKey)
}

function keyPair () {
  const keyPair = nacl.sign.keyPair()

  return {
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
    publicKey: naclUtil.encodeBase64(keyPair.publicKey)
  }
}

function fromSecretKey (secretKey) {
  secretKey = naclUtil.decodeBase64(secretKey)

  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey)

  return {
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
    publicKey: naclUtil.encodeBase64(keyPair.publicKey)
  }
}

function encrypt (data, theirPublicKey, mySecretKey) {
  data = naclUtil.decodeUTF8(data)
  theirPublicKey = convert.publicKey(naclUtil.decodeBase64(theirPublicKey))
  mySecretKey = convert.secretKey(naclUtil.decodeBase64(mySecretKey))

  const nonce = nacl.randomBytes(nacl.box.nonceLength)

  data = nacl.box(data, nonce, theirPublicKey, mySecretKey)

  return {
    data: naclUtil.encodeBase64(data),
    nonce: naclUtil.encodeBase64(nonce)
  }
}

function decrypt (data, nonce, theirPublicKey, mySecretKey) {
  data = naclUtil.decodeBase64(data)
  nonce = naclUtil.decodeBase64(nonce)
  theirPublicKey = convert.publicKey(naclUtil.decodeBase64(theirPublicKey))
  mySecretKey = convert.secretKey(naclUtil.decodeBase64(mySecretKey))

  data = nacl.box.open(data, nonce, theirPublicKey, mySecretKey)

  if (!data) {
    throw new Error('failed opening nacl.box')
  }

  return naclUtil.encodeUTF8(data)
}

function sign (data, mySecretKey) {
  data = naclUtil.decodeUTF8(data)
  mySecretKey = naclUtil.decodeBase64(mySecretKey)

  data = nacl.sign.detached(data, mySecretKey)

  return naclUtil.encodeBase64(data)
}

function verify (data, signature, theirPublicKey) {
  data = naclUtil.decodeUTF8(data)
  signature = naclUtil.decodeBase64(signature)
  theirPublicKey = naclUtil.decodeBase64(theirPublicKey)

  return nacl.sign.detached.verify(data, signature, theirPublicKey)
}

module.exports = {
  keyPair,
  fromSecretKey,
  encrypt,
  decrypt,
  sign,
  verify
}
