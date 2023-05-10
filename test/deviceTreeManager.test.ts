import { expect } from "chai"
import { DeviceTreeManager } from "../src/deviceTreeManager"
import { initSigner } from "../src/utils/keys"

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

        for (let deviceId = 0; deviceId < 4; deviceId++) {
            updateReceipt = devTreeManager.addNewDevice(deviceId)

            console.log({
                idx: updateReceipt["idx"].toString(),
                mk_prf: updateReceipt["mk_prf"].toString(),
                ori_leafNode: updateReceipt["flow"][0]["leaf_node"].toString(),
                ori_root: updateReceipt["flow"][0]["root"].toString(),
                new_leafNode: updateReceipt["flow"][1]["leaf_node"].toString(),
                new_root: updateReceipt["flow"][1]["root"].toString(),
            })
        }
    })

    describe("Simple tests", function () {})
})
