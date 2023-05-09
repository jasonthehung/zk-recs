import { ZKArray, ZKObject } from "../lib/tree/zk-core"
import { Device } from "./device"

const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

let eddsa: any
let babyJub: any

const DeviceTreeHeight = 5

export async function initSigner() {
    eddsa = await buildEddsa()
    babyJub = await buildBabyjub()
}

export class DeviceTreeManager extends ZKArray {
    public numberOfDevices = 0

    // # 透過device id查找Device object
    deviceMap = new Map<number, Device>()

    constructor() {
        if (typeof eddsa === "undefined") {
            throw new Error("Run initSigner() first please.")
        }

        super(DeviceTreeHeight, () => {
            return new Device()
        })
    }

    async addNewDevice(owner: string, deviceId: number, privateKey: string) {
        // check if device already exists
        if (this.deviceMap.has(deviceId)) {
            throw new Error("Device already exists")
        }

        // new Signer(privateKey)

        // calculate PubX PubY
        let F = babyJub.F
        const prvKey = Buffer.from(privateKey, "hex")
        const pubKey = eddsa.prv2pub(prvKey)
        let pubX = F.toObject(pubKey[0])
        let pubY = F.toObject(pubKey[1])

        //  new Device(owner, deviceId, privateKey, pubX, pubY)

        this.numberOfDevices++

        let bigIntOwner = BigInt(owner)
        let bigIntPrivateKey = BigInt(privateKey)

        this.deviceMap.set(
            deviceId,
            new Device(owner, deviceId, privateKey, pubX, pubY)
        )

        return this.do(deviceId, (newDevice) => {
            newDevice.do("owner", (owner) => {
                // ! debug console
                // console.log(`Owner is: ${owner.val()}`)
                owner.set(bigIntOwner)
                // console.log(`Owner is: ${owner.val()}`)
            })
            newDevice.do("privateKey", (privKey) => {
                // ! debug console
                // console.log(`PrivateKey is: ${privKey.val()}`)
                privKey.set(bigIntPrivateKey)
                // console.log(`PrivateKey is: ${privKey.val()}`)
            })
            newDevice.do("Ax", (Ax) => {
                // ! debug console
                // console.log(`Ax is: ${Ax.val()}`)
                Ax.set(pubX)
                // console.log(`Ax is: ${Ax.val()}`)
            })
            newDevice.do("Ay", (Ay) => {
                // ! debug console
                // console.log(`Ay is: ${Ay.val()}`)
                Ay.set(pubY)
                // console.log(`Ay is: ${Ay.val()}`)
            })
        })
    }

    getDevice() {
        console.log(this.toObject())
        return this.toObject()
    }

    updateDeviceOwner(newOwner: string, deviceId: number) {
        let dev = this.deviceMap.get(deviceId)

        if (typeof dev !== "undefined") {
            dev.updateOwner(newOwner)
        }
    }

    deleteDevice(deviceId: number) {
        this.deviceMap.delete(deviceId)
    }
}
