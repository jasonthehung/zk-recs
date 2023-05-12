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

    initDevice(deviceId: number, owner = "0") {
        if (this.devicePrivateKey.get(deviceId) !== undefined) {
            throw new Error("This device has already been registered")
        } else {
            // 隨機算出private key
            let privateKey = getRandomInt().toString()

            // set private key into devicePrivateKey map
            this.devicePrivateKey.set(deviceId, privateKey)

            // 計算得到public key
            const [pubX, pubY] = getPublicKey(privateKey)

            // 把新建立的裝置放入Map中紀錄
            this.deviceMap.set(
                deviceId,
                new Device(owner, deviceId, privateKey, pubX, pubY)
            )

            // return new Device(owner, deviceId, privateKey, pubX, pubY)
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
        return [
            ["0", "0", "0", "0", "0", "0"],
            this.do(deviceId, (newDevice) => {
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
            }),
            [
                bigIntOwner.toString(),
                binIntDeviceId.toString(),
                "0",
                "0",
                pubX.toString(),
                pubY.toString(),
            ],
        ]
    }

    deviceAttest(deviceId: number, value: bigint) {
        let device = this.deviceMap.get(deviceId)

        if (device === undefined) {
            throw new Error(`Device: ${deviceId} haven't been register`)
        } else {
            const thisDevice = this.deviceMap.get(deviceId)

            // 得到device的資料
            // const [_owner, _deviceId, _nonce, _totalKW, _pubX, _pubY] = []
            let _owner
            let _deviceId
            let _nonce
            let _totalKW
            let _pubX
            let _pubY

            // console.log(
            //     `owner: ${_owner}\ndeviceID: ${_deviceId}\nnonce: ${_nonce}\ntotalKW: ${_totalKW}\npubX: ${_pubX}\npubY: ${_pubY}`
            // )

            this.do(deviceId, (newDevice) => {
                newDevice.get("owner", (owner) => {
                    _owner = owner.toObject()
                })
                newDevice.get("deviceId", (deviceId) => {
                    _deviceId = deviceId.toObject()
                })
                newDevice.get("nonce", (nonce) => {
                    _nonce = nonce.toObject()
                })
                newDevice.get("totalKW", (totalKW) => {
                    _totalKW = totalKW.toObject()
                })
                newDevice.get("Ax", (Ax) => {
                    _pubX = Ax.toObject()
                })
                newDevice.get("Ay", (Ay) => {
                    _pubY = Ay.toObject()
                })
            })

            // console.log(debug["flow"][0])
            // console.log(debug["flow"][1])

            // * [0] -> 簽章 & Message & Public Key
            // * [1] -> ori device leaf data
            // * [2] -> merkle proof of updating
            // * [3] -> new device leaf data
            return [
                device.signMsg(value),
                [
                    _owner.toString(),
                    _deviceId.toString(),
                    _nonce.toString(),
                    _totalKW.toString(),
                    _pubX.toString(),
                    _pubY.toString(),
                ],
                this.do(deviceId, (newDevice) => {
                    newDevice.do("owner", (owner) => {
                        owner.set(_owner)
                    })
                    newDevice.do("deviceId", (deviceId) => {
                        deviceId.set(_deviceId)
                    })
                    newDevice.do("nonce", (nonce) => {
                        nonce.set(_nonce + 1n)
                    })
                    newDevice.do("totalKW", (totalKW) => {
                        totalKW.set(_totalKW + value)
                    })
                    newDevice.do("Ax", (Ax) => {
                        Ax.set(_pubX as bigint)
                    })
                    newDevice.do("Ay", (Ay) => {
                        Ay.set(_pubY as bigint)
                    })
                }),
                [
                    _owner.toString(),
                    _deviceId.toString(),
                    (_nonce + 1n).toString(),
                    (_totalKW + value).toString(),
                    _pubX.toString(),
                    _pubY.toString(),
                ],
            ]
        }
    }

    getDevice() {
        return this.toObject()
    }

    // TODO
    updateDeviceOwner(newOwner: string, deviceId: number) {}

    // TODO
    deleteDevice(deviceId: number) {}
}
