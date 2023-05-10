import { ZKArray } from "../lib/tree/zk-core"
import { Device } from "./device"
import { getPublicKey, getRandomInt } from "./utils/keys"

export class DeviceTreeManager extends ZKArray {
    public numberOfDevices = 0

    // 透過device ID查找Device object
    deviceMap = new Map<number, Device>()
    // 透過device ID查找device private key
    devicePrivateKey = new Map<number, string>()

    constructor(deviceTreeHeight: number, amountOfDevices: number) {
        // 如果要求的device數量超過Merkle Tree最大容量, 則throw new error
        if (2 ** deviceTreeHeight < amountOfDevices) {
            throw new Error("Tree height is too low")
        }

        super(deviceTreeHeight, () => {
            // 若是不給引數，代表創建一個全部欄位都是預設的device，並且device ID為0
            // Note: new Device並不會把新建的device加入到Merkle Tree
            return new Device()
        })
    }

    private initDevicePrivateKey(amount: number) {
        for (let i = 0; i < amount; i++) {
            // 隨機計算出private key給對應的device
            let privKey = getRandomInt().toString()

            this.devicePrivateKey.set(i, privKey)
        }
    }

    /**
     *
     * @param deviceId 裝置的ID
     * @param owner 裝置的持有人 (若沒給則為"0")
     * @returns merkle proof, index, leaf node, root hash
     */
    addNewDevice(deviceId: number, owner = "0") {
        // check if device already exists
        if (this.deviceMap.has(deviceId)) {
            throw new Error("Device already exists")
        }
        let privKey = getRandomInt().toString()

        this.devicePrivateKey.set(deviceId, privKey)

        // 查表找出device的private key
        const privateKey = this.devicePrivateKey.get(deviceId)

        // 得到public key
        const [pubX, pubY] = getPublicKey(privateKey)

        // 總共的裝置數量+1
        this.numberOfDevices++

        // 把owner轉成BigInt type
        let bigIntOwner: bigint = BigInt(owner)

        // 把device ID轉成BigInt type
        let binIntDeviceId = BigInt(deviceId)

        // 把新建立的裝置放入Map中紀錄
        this.deviceMap.set(
            deviceId,
            new Device(owner, deviceId, privateKey, pubX, pubY)
        )

        // 把新建立的裝置存入Merkle Tree中紀錄
        return this.do(deviceId, (newDevice) => {
            newDevice.do("owner", (owner) => {
                owner.set(bigIntOwner)
            })
            newDevice.do("deviceId", (deviceId) => {
                deviceId.set(binIntDeviceId)
            })
            newDevice.do("nonce", (nonce) => {
                nonce.set(0n)
            })
            newDevice.do("totalKW", (totalKW) => {
                totalKW.set(0n)
            })
            newDevice.do("Ax", (Ax) => {
                Ax.set(pubX)
            })
            newDevice.do("Ay", (Ay) => {
                Ay.set(pubY)
            })
        })
    }

    getDevice() {
        return this.toObject()
    }

    // TODO
    updateDeviceOwner(newOwner: string, deviceId: number) {}

    // TODO
    deleteDevice(deviceId: number) {
        this.deviceMap.delete(deviceId)
    }
}
