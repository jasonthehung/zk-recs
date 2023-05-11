import { poseidon } from "@big-whale-labs/poseidon"
import { Request } from "./request"
import { Signature } from "./signature"
import { ZKObject } from "../lib/tree/zk-core"

const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

let eddsa
let babyJub

export async function initSignerFromDevice() {
    eddsa = await buildEddsa()
    babyJub = await buildBabyjub()
}

export class Device extends ZKObject {
    static required = ["owner", "deviceId", "nonce", "totalKW", "Ax", "Ay"]

    public owner: bigint
    public deviceId: bigint
    public nonce = 0n

    public totalKW = 0n

    private privateKey: string
    public Ax: unknown // public key X
    public Ay: unknown // public key Y

    // 如果new Device的時候不給參數, 則代表是新增一個deviceTreeManager, 只有指定樹高
    constructor(
        owner: string = "0",
        deviceId: number = 0,
        privateKey: string = "0",
        Ax: unknown = 0n,
        Ay: unknown = 0n
    ) {
        super(Device.required)

        this.owner = BigInt(owner)
        this.deviceId = BigInt(deviceId)
        this.privateKey = privateKey
        this.Ax = Ax
        this.Ay = Ay
    }

    signMsg(value: bigint) {
        const prvKey = Buffer.from(this.privateKey, "hex")
        // const msg = babyJub.F.e(this.encodeReqToMsg(req))

        const msg = babyJub.F.e(value)

        // console.log(`msg: ${babyJub.F.toObject(msg)}`)
        // console.log(`Ax: ${this.Ax}`)
        // console.log(`Ay: ${this.Ay}`)
        // console.log(`private key: ${this.privateKey}`)

        const sig = eddsa.signPoseidon(prvKey, msg)

        // console.log(babyJub.F.toObject(sig.R8[0]))
        // console.log(babyJub.F.toObject(sig.R8[1]))

        return [
            { M: value, Ax: this.Ax, Ay: this.Ay },
            new Signature(
                babyJub.F.toObject(sig.R8[0]),
                babyJub.F.toObject(sig.R8[1]),
                sig.S
            ),
        ]
    }

    private encodeReqToMsg(request: Request): bigint {
        return poseidon(request.rawRequestInBigint)
    }

    private genRequest(value: bigint): Request {
        return new Request([this.owner, value].map((e) => BigInt(e)))
    }

    updateOwner(newOwner: string) {
        this.owner = BigInt(newOwner)
    }
}

// signPoseidon(sig_msg: bigint) {
//     const msg = babyJub.F.e(sig_msg)
//     const sig = eddsa.signPoseidon(this.privkey, msg)
//     return new Signature(
//         babyJub.F.toObject(sig.R8[0]),
//         babyJub.F.toObject(sig.R8[1]),
//         sig.S
//     )
// }
// signRequest(req: Request) {
//     return new Request(
//         req.req_datas,
//         this.signPoseidon(poseidon(req.req_datas))
//     )
// }
