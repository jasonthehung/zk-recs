import { ZKArray, ZKObject, ZKObjectReadOnly } from "./zk-core"
import { Request } from "../types/type-req"

export const default_config = {
    normal_batch_height: 6, // batch_size is 64
    register_batch_size: 8,
    match_batch_size: 1,
    l2_acc_addr_size: 8,
    l2_token_addr_size: 8,
    token_tree_height: 8,
    isPendingRollup: false, //?
    order_tree_height: 8,

    auction_market_count: 1,
    auction_lender_count: 10,
    auction_borrower_count: 4,
}

export class TokenLeaf extends ZKObject {
    static required = ["l2TokenAddr", "avlAmt", "lockedAmt"]
    constructor() {
        super(TokenLeaf.required)
    }
}
export class TokenTree extends ZKArray {
    constructor(config) {
        super(config.token_tree_height, () => {
            return new TokenLeaf()
        })
    }
}
export class AccLeaf extends ZKObject {
    static required = ["tsPubkeyX", "tsPubkeyY", "nonce", "tokenRoot"]
    constructor(config) {
        super(AccLeaf.required)
        this.do("tokenRoot", (e) => e.point_to(new TokenTree(config)))
    }
}
export namespace AccLeaf {
    export enum L2AddrFixedAcc {
        BURN_ADDR = 0,
        MINT_ADDR = 1,
        WITHDRAW_ADDR = 2,
        REDEEM_ADDR = 3,
        AUCTION_ADDR = 10,
        SECONDARY_ACC = 11,
        REPO_ACC = 12,
    }
}
export class AccTree extends ZKArray {
    constructor(config) {
        super(
            config.l2_acc_addr_size,
            () => {
                return new AccLeaf(config)
            },
            0n
        ) //!! change default acc_leaf
        for (let i in AccLeaf.L2AddrFixedAcc) //!! trace enum: correct in "lib": ["es2020", "esnext"];
            if (isNaN(Number(i)))
                this.do(Number(AccLeaf.L2AddrFixedAcc[i]), (acc) => {})
    }
}
export class OrderLeaf extends ZKObject {
    static required = [
        "reqType",
        "l2AddrFrom",
        "l2AddrTo",
        "l2TokenAddr",
        "amount",
        "nonce",
        "arg0",
        "arg1",
        "arg2",
        "arg3",
        "arg4",
        "txId",
    ]
    constructor() {
        super(OrderLeaf.required)
        let default_val = [
            0n,
            BigInt(AccLeaf.L2AddrFixedAcc.MINT_ADDR),
            BigInt(AccLeaf.L2AddrFixedAcc.AUCTION_ADDR),
            0n,
            0n,
            0n,
            0n,
            0n,
            0n,
            0n,
            1n,
            0n,
        ]
        for (let i = 0; i < OrderLeaf.required.length; ++i)
            this.do(OrderLeaf.required[i], (e) => e.set(default_val[i]))
    }
    static toReqest(zk_obj: ZKObjectReadOnly): Request {
        return new Request(
            this.required.slice(0, this.required.length - 1).map((idx) => {
                let t: bigint
                zk_obj.get(idx, (e) => (t = e.val()))
                return t
            })
        )
    }
}
export class OrderTree extends ZKArray {
    constructor(config) {
        super(config.order_tree_height, () => {
            return new OrderLeaf()
        })
        this.do(0, (e) => {})
    }
}
export class StateTree extends ZKObject {
    static required = ["accRoot", "orderRoot", "txCount"]
    constructor(protected config_ = default_config) {
        super(StateTree.required)
        this.do("accRoot", (e) => e.point_to(new AccTree(config_)))
        this.do("orderRoot", (e) => e.point_to(new OrderTree(config_)))
        this.do("txCount", (e) => e.set(0n))
    }
}
