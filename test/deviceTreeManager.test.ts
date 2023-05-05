const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

import { assert } from "chai"
import { DeviceTreeManager, initSigner } from "../src/deviceTreeManager"
import { Device } from "../src/device"

describe("DeviceTreeManager class test", function () {
    let eddsa: any
    let babyJub: any
    let F: any
    let devTreeManager: DeviceTreeManager

    let device: Device
    let pubX
    let pubY

    before(async () => {
        eddsa = await buildEddsa()
        babyJub = await buildBabyjub()
        F = babyJub.F

        await initSigner()

        devTreeManager = new DeviceTreeManager()
    })

    it("add new device into leaf", async () => {
        await devTreeManager.addNewDevice("1", 1, "1")
    })

    /* it("add 10 new device into leaf", async () => {
        for (let i = 1; i <= 10; i++) {
            let result = await devTreeManager.addNewDevice(
                i.toString(),
                i,
                i.toString()
            )
            console.log(result)
        }
    }) */

    describe("Function: addNewDevice test", function () {
        let owner: string
        let privateKey: string

        before(async () => {
            owner = "1"
            privateKey = "1"
        })

        it("addNewDevice", async () => {
            let privateKeyBuffer = Buffer.from(privateKey, "hex")
            let publicKey = eddsa.prv2pub(privateKeyBuffer)

            let publicKey_x = babyJub.F.toObject(publicKey[0])
            let publicKey_y = babyJub.F.toObject(publicKey[1])

            let newDevice = await devTreeManager.addNewDevice(
                owner,
                0,
                privateKey
            )
        })
    })

    describe("Simple tests", function () {
        it("constructor", async () => {
            let devTreeManager = new DeviceTreeManager()

            assert.equal(devTreeManager.numberOfDevices, 0)
        })

        it("deviceMap", async () => {
            let size = devTreeManager.deviceMap.size

            assert.equal(size, 0)
        })
    })
})

// let privkey = Buffer.from(str_priv_key, "hex")
//         let pubkey = eddsa.prv2pub(privkey)
