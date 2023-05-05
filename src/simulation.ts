import { Device } from "./device"
import { privateKey, publicKey } from "./defaultSettings"

// 1. get a new device
let device = new Device("Jason", 0n, 0n, 0n, privateKey, publicKey)

console.log(device)
