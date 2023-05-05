const buildEddsa = require("circomlibjs").buildEddsa
const buildBabyjub = require("circomlibjs").buildBabyjub

let eddsa: any
let babyJub: any

export async function initSigner() {
    eddsa = await buildEddsa()
    babyJub = await buildBabyjub()
}

export class AccountClient {
    public privkey
    public pubkey_x
    public pubkey_y

    constructor(str_priv_key: string) {
        if (typeof eddsa === "undefined") {
            throw new Error("Run initSigner() first please.")
        }

        let privkey = Buffer.from(str_priv_key, "hex")
        let pubkey = eddsa.prv2pub(privkey)

        this.pubkey_x = babyJub.F.toObject(pubkey[0])
        this.pubkey_y = babyJub.F.toObject(pubkey[1])
        this.privkey = privkey
    }
}
