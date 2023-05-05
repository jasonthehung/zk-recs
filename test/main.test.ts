const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

import { assert } from "chai"
import {
    DeviceTreeManager,
    initSigner as initDeviceTreeSigner,
} from "../src/deviceTreeManager"
import { initSigner } from "../src/device"

describe("Main", function () {
    let eddsa: any
    let babyJub: any
    let F: any
    let deviceTreeManager: DeviceTreeManager

    before(async () => {
        eddsa = await buildEddsa()
        babyJub = await buildBabyjub()
        F = babyJub.F

        await initSigner()
        await initDeviceTreeSigner()

        deviceTreeManager = new DeviceTreeManager()
    })

    it("add new device and sign msg", async () => {
        // Add new device (owner, deviceId, privateKey)
        await deviceTreeManager.addNewDevice("1", 1, "1")

        let device = deviceTreeManager.deviceMap.get(1)
        let signature = device.signMsg(1n)

        console.log(signature)
    })
})
