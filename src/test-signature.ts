import { secp256k1 } from "@noble/curves/secp256k1"
import { TextDecoder } from "text-encoding"

const priv = secp256k1.utils.randomPrivateKey()
const pub = secp256k1.getPublicKey(priv)
const msg = new Uint8Array(32).fill(1)
const sig = secp256k1.sign(msg, priv)
secp256k1.verify(sig, msg, pub) === true

// hex strings are also supported besides Uint8Arrays:
const privHex =
    "46c930bc7bb4db7f55da20798697421b98c4175a52c630294d75a84b9c126236"
const pub2 = secp256k1.getPublicKey(privHex)

// ----------------------------------------------------------------

import { ed25519 } from "@noble/curves/ed25519"
const privateKey = ed25519.utils.randomPrivateKey()
const publicKey = ed25519.getPublicKey(privateKey)
const msg2 = new Uint8Array(32).fill(1)
const signature = ed25519.sign(msg, privateKey)

// console.log(signature)
ed25519.verify(signature, msg2, publicKey)

// let res = new TextDecoder().decode(privateKey)

// let view = new DataView(privateKey.buffer, 0)
// let res = view.getBigUint64(0, true)
// console.log(res)

let bitsRes = buffer2bits(signature)
const test_msg = Buffer.from("00010203040506070809", "hex")
// console.log(test_msg)
// console.log(buffer2bits(test_msg))

// console.log(bitsRes)

function buffer2bits(buff: any) {
    console.log(buff.length)
    const res = []
    for (let i = 0; i < buff.length; i++) {
        for (let j = 0; j < 8; j++) {
            if ((buff[i] >> j) & 1) {
                res.push(1n)
            } else {
                res.push(0n)
            }
        }
    }

    return res
}
