const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

import { Device, initSigner } from "../src/device"

describe("Device class test", function () {
    let eddsa: any
    let babyJub: any
    let F: any

    before(async () => {
        eddsa = await buildEddsa()
        babyJub = await buildBabyjub()
        F = babyJub.F

        await initSigner()
    })

    it("Function: signMsg test", async () => {
        const prvKey = Buffer.from("1", "hex")

        const pubKey = eddsa.prv2pub(prvKey)

        let pubX = F.toObject(pubKey[0])
        let pubY = F.toObject(pubKey[1])

        let dev = new Device("1", 0, "1", BigInt(pubX), BigInt(pubY))

        let a = dev.signMsg(1234n)

        console.log(a)
    })
})
