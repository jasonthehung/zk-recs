import { expect } from "chai"
import { DeviceTreeManager } from "../src/deviceTreeManager"
import { initSigner } from "../src/utils/keys"
import { readFile } from "../src/utils/writeFile"

import * as fs from "fs"
import * as path from "path"

describe("DeviceTreeManager Class", function () {
    before(async () => {
        await initSigner()
    })

    it("Tree height is too low", async () => {
        // 2^2 = 4 max leaf nodes
        // 4 < 5

        expect(() => new DeviceTreeManager(2, 5)).to.throw(
            Error,
            "Tree height is too low"
        )
    })

    it("add 4 new devices", async () => {
        let devTreeManager: DeviceTreeManager = new DeviceTreeManager(2, 4)
        let updateReceipt

        let deviceIndexArray = []
        let merkleProofArray = []
        let oriLeafArray = []
        let newLeafArray = []
        let oriRootArray = []
        let newRootArray = []

        for (let deviceId = 0; deviceId < 2; deviceId++) {
            updateReceipt = devTreeManager.addNewDevice(deviceId)

            deviceIndexArray.push(updateReceipt[1]["idx"].toString())
            merkleProofArray.push(
                updateReceipt[1]["mk_prf"].map((val) => val.toString())
            )
            oriLeafArray.push(updateReceipt[0])
            newLeafArray.push(updateReceipt[2])
            oriRootArray.push(updateReceipt[1]["flow"][0]["root"].toString())
            newRootArray.push(updateReceipt[1]["flow"][1]["root"].toString())
            // console.log({
            //     deviceIndex: updateReceipt[1]["idx"].toString(),
            //     merkleProof: updateReceipt[1]["mk_prf"].map((val) =>
            //         val.toString()
            //     ),
            //     oriLeaf: updateReceipt[0],
            //     newLeaf: updateReceipt[2],
            //     oriRoot: updateReceipt[1]["flow"][0]["root"].toString(),
            //     newRoot: updateReceipt[1]["flow"][1]["root"].toString(),
            //     // ori_leafNode:
            //     //     updateReceipt[1]["flow"][0]["leaf_node"].toString(),

            //     // new_leafNode:
            //     //     updateReceipt[1]["flow"][1]["leaf_node"].toString(),
            // })
        }

        const result = JSON.stringify({
            deviceIndex: deviceIndexArray,
            merkleProof: merkleProofArray,
            oriLeaf: oriLeafArray,
            newLeaf: newLeafArray,
            oriRoot: oriRootArray,
            newRoot: newRootArray,
        })

        fs.writeFileSync("../../inputs", result)

        console.log(result)
    })

    describe("Simple tests", function () {})
})
