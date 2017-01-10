/* eslint-env node, mocha */
import { expect } from 'chai'
import * as module from '../src/index.js'

describe('key generation', () => {
  it('generates a key pair', () => {
    const keyPair = module.keyPair()
    expect(keyPair.secretKey).to.be.a('string')
    expect(keyPair.publicKey).to.be.a('string')
  })

  it('generates a key pair from the secret key', () => {
    const keyPair = module.keyPair()
    const keyPairFromSecretKey = module.fromSecretKey(keyPair.secretKey)
    expect(keyPair).to.deep.equal(keyPairFromSecretKey)
  })
})

describe('encryption', () => {
  it('encrypts and decrypts', () => {
    const myKeyPair = module.keyPair()
    const theirKeyPair = module.keyPair()
    const data = 'some data to encrypt'

    const encrypted = module.encrypt(data, theirKeyPair.publicKey, myKeyPair.secretKey)
    expect(encrypted.data).to.be.a('string')
    expect(encrypted.nonce).to.be.a('string')

    const decrypted = module.decrypt(encrypted.data, encrypted.nonce, myKeyPair.publicKey, theirKeyPair.secretKey)
    expect(decrypted).to.equal(data)

    const decrypted2 = module.decrypt(encrypted.data, encrypted.nonce, myKeyPair.publicKey, theirKeyPair.secretKey)
    expect(decrypted2).to.equal(data)
  })

  it('fails decryption when using the wrong key', () => {
    const randomKeyPair = module.keyPair()
    const publicKey = 'J2rbR/Be2ukJuf6od+amUufeb4iN3pnF8hOHTprfUgY='
    const encrypted = {
      data: '1WTd5WyEhy9lX+z1ibF2C4ChghbAKfYmM/DV4LePC2us+cfU',
      nonce: 'u8VL7Ekv7GiJcThczjbYgfI/ZN95OdUz'
    }

    expect(() => {
      module.decrypt(encrypted.data, encrypted.nonce, publicKey, randomKeyPair.secretKey)
    }).to.throw('failed opening nacl.box')
  })
})

describe('signing', () => {
  it('signs and verifies', () => {
    const myKeyPair = module.keyPair()
    const data = 'some data to sign'

    const signed = module.sign(data, myKeyPair.secretKey)
    expect(signed).to.be.a('string')

    const verified = module.verify(data, signed, myKeyPair.publicKey)
    expect(verified).to.equal(true)
  })

  it('fails verification for the wrong key', () => {
    const myKeyPair = module.keyPair()
    const otherKeyPair = module.keyPair()
    const data = 'some data to sign'
    const signed = module.sign(data, myKeyPair.secretKey)

    const verified = module.verify(data, signed, otherKeyPair.publicKey)
    expect(verified).to.equal(false)
  })
})
