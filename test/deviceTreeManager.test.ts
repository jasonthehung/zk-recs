const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

import { assert } from "chai"
import { DeviceTreeManager, initSigner } from "../src/deviceTreeManager"

describe("DeviceTreeManager Class", function () {
    let eddsa: any
    let babyJub: any
    let F: any
    let devTreeManager: DeviceTreeManager

    before(async () => {
        eddsa = await buildEddsa()
        babyJub = await buildBabyjub()
        F = babyJub.F

        await initSigner()

        devTreeManager = new DeviceTreeManager()
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
            let newDevice = await devTreeManager.addNewDevice(
                owner,
                1,
                privateKey
            )

            console.log(newDevice)
        })
    })

    describe("Simple tests", function () {
        it("constructor", async () => {
            let devTreeManager = new DeviceTreeManager()

            assert.equal(devTreeManager.numberOfDevices, 0)
        })

        it("deviceMap", async () => {
            let size = devTreeManager.deviceMap.size

            // assert.equal(size, 0)
        })
    })
})
