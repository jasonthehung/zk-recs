import { Signature } from "./signature"

export class Request {
    public rawRequestInBigint: Array<bigint>

    constructor(rawRequestInBigint: Array<bigint>) {
        this.rawRequestInBigint = rawRequestInBigint

        // for (let i = this.req_datas.length; i < LengthOfReqDatas; ++i)
        //     this.req_datas.push(0n)
    }
}

// export function genSingleAttestRequest(deviceId: bigint, value: bigint) {
//     return new Request(["Attest", deviceId, value].map((e) => BigInt(e)))
// }
