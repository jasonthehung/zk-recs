import { poseidon } from "@big-whale-labs/poseidon"
import { MerkleTree } from "./merkle-tree"
const default_config = {
    mod: 21888242871839275222246405745257275088548364400416034343698204186575808495617n,
    hash_fn: (arr: Array<bigint>) => poseidon(arr),
}
export class ZKVariableReadOnly {
    protected val_: bigint = 0n
    protected ptr_: ZKArray = null
    val(): bigint {
        return this.val_
    }
    get(callbackfn: (elem: ZKArrayReadOnly) => void) {
        callbackfn(this.ptr_)
    }
    toObject() {
        if (this.ptr_ == null) return this.val_
        else return this.ptr_.toObject()
    }
}
export class ZKVariable extends ZKVariableReadOnly {
    constructor(private mod_ = default_config.mod) {
        super()
    }
    set(val: bigint) {
        this.val_ = (val < 0n ? this.mod_ : 0n) + (val % this.mod_)
        this.ptr_ = null
    }
    point_to(arr: ZKArray) {
        this.ptr_ = arr
        this.val_ = this.ptr_.digest()
    }
    do(callbackfn: (elem: ZKArray) => void) {
        callbackfn(this.ptr_)
        this.val_ = this.ptr_.digest()
    }
}
export class ZKObjectReadOnly {
    protected ptrs_: Array<ZKVariable> = []
    protected map_ = new Map<string, number>()
    get(idx: string, callbackfn: (elem: ZKVariableReadOnly) => void) {
        if (this.map_.has(idx)) callbackfn(this.ptrs_[this.map_.get(idx)])
        else throw new Error("invalid idx.")
    }
    val() {
        let obj = {}
        for (let slot of this.map_) obj[slot[0]] = this.ptrs_[slot[1]].val()
        return obj
    }
    toObject() {
        let obj: any = {}
        for (let slot of this.map_)
            obj[slot[0]] = this.ptrs_[slot[1]].toObject()
        return obj
    }
}
export class ZKObject extends ZKObjectReadOnly {
    constructor(
        required_: Array<string>,
        gen_default_elem_ = () => {
            return new ZKVariable()
        },
        private hash_ = default_config.hash_fn
    ) {
        super()
        for (let i = 0; i < required_.length; ++i) {
            this.map_.set(required_[i], i)
            this.ptrs_.push(gen_default_elem_())
        }
    }
    do(idx: string, callbackfn: (elem: ZKVariable) => void) {
        if (this.map_.has(idx)) callbackfn(this.ptrs_[this.map_.get(idx)])
        else throw new Error("invalid idx.")
    }
    digest(): bigint {
        return this.hash_(this.ptrs_.map((e) => e.val())) //!!b
    }
}
export class ZKArrayReadOnly {
    protected map_ = new Map<number, ZKObject>()
    protected capacity_: number
    constructor(protected gen_default_elem_: () => ZKObject) {}

    get(idx: number, callbackfn: (elem: ZKObjectReadOnly) => void) {
        if (!this.map_.has(idx)) {
            if (idx < this.capacity_ && idx >= 0)
                throw new Error("undefined elem." + "idx: " + idx)
            else throw new Error("exceed the array size.")
        }
        callbackfn(this.map_.get(idx))
    }

    toObject() {
        let obj = [] // as JSArray:JSObject in slow mode. #V8
        for (let slot of this.map_) obj[slot[0]] = slot[1].toObject()
        return obj
    }
}
export class ZKArray extends ZKArrayReadOnly {
    private mk_tree_: MerkleTree
    constructor(
        bits_capacity: number,
        gen_default_elem_: () => ZKObject,
        private default_elem_digest_?: bigint,
        hash_ = default_config.hash_fn
    ) {
        super(gen_default_elem_)
        this.capacity_ = 1 << bits_capacity
        if (this.default_elem_digest_ == undefined)
            this.default_elem_digest_ = gen_default_elem_().digest()
        this.mk_tree_ = new MerkleTree(
            bits_capacity,
            this.default_elem_digest_,
            hash_
        )
    }
    do(idx: number, callbackfn: (elem: ZKObject) => void) {
        let ori_root = this.mk_tree_.getRoot()
        if (!this.map_.has(idx)) {
            if (idx < this.capacity_ && idx >= 0)
                this.map_.set(idx, this.gen_default_elem_())
            else throw new Error("exceed the array size." + idx)
        }
        let elem = this.map_.get(idx)
        let ori_elem_obj = elem.val()
        let ori_leaf_node = this.mk_tree_.getLeafNode(idx)
        let mk_prf: Array<bigint>
        callbackfn(elem)
        mk_prf = this.mk_tree_.updateLeafNode(idx, elem.digest())

        return {
            idx: idx,
            mk_prf: mk_prf,
            flow: [
                {
                    root: ori_root,
                    elem: ori_elem_obj,
                    leaf_node: ori_leaf_node,
                },
                {
                    root: this.mk_tree_.getRoot(),
                    elem: elem.val(),
                    leaf_node: this.mk_tree_.getLeafNode(idx),
                },
            ],
        }
    }
    initialize(idx: number) {
        let ori_root = this.mk_tree_.getRoot()
        let ori_elem_obj = this.map_.has(idx) ? this.map_.get(idx).val() : {}
        let ori_leaf_node = this.mk_tree_.getLeafNode(idx)
        let mk_prf
        if (this.map_.delete(idx))
            mk_prf = this.mk_tree_.updateLeafNode(
                idx,
                this.default_elem_digest_
            )
        else mk_prf = this.mk_tree_.extractMkPrf(idx)
        return {
            idx: idx,
            mk_prf: mk_prf,
            flow: [
                {
                    root: ori_root,
                    elem: ori_elem_obj,
                    leaf_node: ori_leaf_node,
                },
                {
                    root: this.mk_tree_.getRoot(),
                    elem: null,
                    leaf_node: this.mk_tree_.getLeafNode(idx),
                },
            ],
        }
    }
    digest(): bigint {
        return this.mk_tree_.getRoot()
    }
}
