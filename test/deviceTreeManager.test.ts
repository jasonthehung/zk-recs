import { expect } from "chai"
import { DeviceTreeManager } from "../src/deviceTreeManager"
import { initSigner } from "../src/utils/keys"
import { initSignerFromDevice } from "../src/device"

import * as fs from "fs"
import { Device } from "../src/device"

describe("DeviceTreeManager Class", function () {
    before(async () => {
        await initSigner()

        await initSignerFromDevice()
    })

    it("Tree height is too low", async () => {
        // 2^2 = 4 max leaf nodes
        // 4 < 5

        expect(() => new DeviceTreeManager(2, 5)).to.throw(
            Error,
            "Tree height is too low"
        )
    })

    /* it("add new devices", async () => {
        let devTreeManager: DeviceTreeManager = new DeviceTreeManager(6, 50)
        let updateReceipt

        let deviceIndexArray = []
        let merkleProofArray = []
        let oriLeafArray = []
        let newLeafArray = []
        let oriRootArray = []
        let newRootArray = []

        for (let deviceId = 0; deviceId < 50; deviceId++) {
            updateReceipt = devTreeManager.addNewDevice(deviceId)

            deviceIndexArray.push(updateReceipt[1]["idx"].toString())
            merkleProofArray.push(
                updateReceipt[1]["mk_prf"].map((val) => val.toString())
            )
            oriLeafArray.push(updateReceipt[0])
            newLeafArray.push(updateReceipt[2])
            oriRootArray.push(updateReceipt[1]["flow"][0]["root"].toString())
            newRootArray.push(updateReceipt[1]["flow"][1]["root"].toString())
        }

        const result = JSON.stringify({
            deviceIndex: deviceIndexArray,
            merkleProof: merkleProofArray,
            oriLeaf: oriLeafArray,
            newLeaf: newLeafArray,
            oriRoot: oriRootArray,
            newRoot: newRootArray,
        })

        const folderPath = "./inputs"
        const fileName = "zkRECRegister_input.json"
        const filePath = `${folderPath}/${fileName}`

        fs.writeFileSync(filePath, result)

        console.log(result)
    }) */

    it("Device sign msg and update merkle tree leaf", () => {
        let devTreeManager: DeviceTreeManager = new DeviceTreeManager(10, 1024)

        let MsgArray = []
        let AxArray = []
        let AyArray = []
        let R8xArray = []
        let R8yArray = []
        let SArray = []

        let deviceIndexArray = []
        let merkleProofArray = []
        let oriLeafArray = []
        let newLeafArray = []
        let oriRootArray = []
        let newRootArray = []

        for (let deviceId = 0; deviceId < 2; deviceId++) {
            devTreeManager.initDevice(deviceId)

            let signature = devTreeManager.deviceAttest(deviceId, 99n)

            MsgArray.push(signature[0][0]["M"].toString())
            AxArray.push(signature[0][0]["Ax"].toString())
            AyArray.push(signature[0][0]["Ay"].toString())
            R8xArray.push(signature[0][1]["R8x"].toString())
            R8yArray.push(signature[0][1]["R8y"].toString())
            SArray.push(signature[0][1]["S"].toString())

            deviceIndexArray.push(signature[2]["idx"].toString())
            merkleProofArray.push(
                signature[2]["mk_prf"].map((val) => val.toString())
            )
            oriLeafArray.push(signature[1])
            newLeafArray.push(signature[3])
            oriRootArray.push(signature[2]["flow"][0]["root"].toString())
            newRootArray.push(signature[2]["flow"][1]["root"].toString())
        }

        const result = JSON.stringify({
            enabled: "1",
            Ax: AxArray,
            Ay: AyArray,
            R8x: R8xArray,
            R8y: R8yArray,
            S: SArray,
            M: MsgArray,

            deviceIndex: deviceIndexArray,
            merkleProof: merkleProofArray,
            oriLeaf: oriLeafArray,
            newLeaf: newLeafArray,
            oriRoot: oriRootArray,
            newRoot: newRootArray,
        })

        const folderPath = "./inputs"
        const fileName = "zkREC_input.json"
        const filePath = `${folderPath}/${fileName}`

        fs.writeFileSync(filePath, result)

        // console.log(result)
    })
})
