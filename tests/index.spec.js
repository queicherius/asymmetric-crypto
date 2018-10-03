/* eslint-env jest */
const crypto = require('../src/index.js')

describe('key generation', () => {
  it('generates a key pair', () => {
    const keyPair = crypto.keyPair()
    expect(typeof keyPair.secretKey).toEqual('string')
    expect(typeof keyPair.publicKey).toEqual('string')
  })

  it('generates a key pair from the secret key', () => {
    const keyPair = crypto.keyPair()
    const keyPairFromSecretKey = crypto.fromSecretKey(keyPair.secretKey)
    expect(keyPair).toEqual(keyPairFromSecretKey)
  })
})

describe('encryption', () => {
  it('encrypts and decrypts', () => {
    const myKeyPair = crypto.keyPair()
    const theirKeyPair = crypto.keyPair()
    const data = 'some data to encrypt'

    const encrypted = crypto.encrypt(data, theirKeyPair.publicKey, myKeyPair.secretKey)
    expect(typeof encrypted.data).toEqual('string')
    expect(typeof encrypted.nonce).toEqual('string')

    const decrypted = crypto.decrypt(encrypted.data, encrypted.nonce, myKeyPair.publicKey, theirKeyPair.secretKey)
    expect(decrypted).toEqual(data)

    const decrypted2 = crypto.decrypt(encrypted.data, encrypted.nonce, myKeyPair.publicKey, theirKeyPair.secretKey)
    expect(decrypted2).toEqual(data)
  })

  it('fails decryption when using the wrong key', () => {
    const randomKeyPair = crypto.keyPair()
    const publicKey = 'J2rbR/Be2ukJuf6od+amUufeb4iN3pnF8hOHTprfUgY='
    const encrypted = {
      data: '1WTd5WyEhy9lX+z1ibF2C4ChghbAKfYmM/DV4LePC2us+cfU',
      nonce: 'u8VL7Ekv7GiJcThczjbYgfI/ZN95OdUz'
    }

    expect(() => {
      crypto.decrypt(encrypted.data, encrypted.nonce, publicKey, randomKeyPair.secretKey)
    }).toThrow('failed opening nacl.box')
  })
})

describe('signing', () => {
  it('signs and verifies', () => {
    const myKeyPair = crypto.keyPair()
    const data = 'some data to sign'

    const signed = crypto.sign(data, myKeyPair.secretKey)
    expect(typeof signed).toEqual('string')

    const verified = crypto.verify(data, signed, myKeyPair.publicKey)
    expect(verified).toEqual(true)
  })

  it('fails verification for the wrong key', () => {
    const myKeyPair = crypto.keyPair()
    const otherKeyPair = crypto.keyPair()
    const data = 'some data to sign'
    const signed = crypto.sign(data, myKeyPair.secretKey)

    const verified = crypto.verify(data, signed, otherKeyPair.publicKey)
    expect(verified).toEqual(false)
  })
})
