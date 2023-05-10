const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

let eddsa: any
let babyJub: any
let F: any

const MAX = 10000000000000

export async function initSigner() {
    eddsa = await buildEddsa()
    babyJub = await buildBabyjub()
}

export function getPublicKey(privateKey: string) {
    F = babyJub.F
    const prvKey = Buffer.from(privateKey, "hex")
    const pubKey = eddsa.prv2pub(prvKey)
    const pubX = F.toObject(pubKey[0])
    const pubY = F.toObject(pubKey[1])

    return [pubX, pubY]
}

export function getRandomInt() {
    return Math.floor(Math.random() * MAX)
}
