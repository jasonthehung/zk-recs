export class MerkleTree {
    public nodes: bigint[] = []
    protected leaf_count_: number

    constructor(
        tree_height: number,
        default_leaf_node: bigint,
        protected hash_: (value: bigint[]) => bigint
    ) {
        this.leaf_count_ = 1 << tree_height
        this.nodes = new Array(this.leaf_count_ << 1)
        for (var i = this.leaf_count_; i < this.nodes.length; ++i)
            this.nodes[i] = default_leaf_node
        for (var i = tree_height - 1; i >= 0; --i) {
            let num = 1 << i
            this.nodes[num] = this.hash_([
                this.nodes[num * 2],
                this.nodes[num * 2 + 1],
            ])
            for (var j = 1; j < num; ++j) this.nodes[num + j] = this.nodes[num]
        }
    }
    getRoot(): bigint {
        return this.nodes[1]
    }
    getLeafNode(leaf_id: number): bigint {
        return this.nodes[leaf_id + this.leaf_count_]
    }
    extractMkPrf(leaf_id: number): bigint[] {
        const prf = []
        for (var i = leaf_id + this.leaf_count_; i > 1; i = Math.floor(i / 2))
            prf.push(this.nodes[[i + 1, i - 1][i % 2]])
        return prf
    }
    updateLeafNode(leaf_id: number, digest_value: bigint): bigint[] {
        var prf = this.extractMkPrf(leaf_id)
        var leaf_node_id = leaf_id + this.leaf_count_
        this.nodes[leaf_node_id] = digest_value
        for (var i = leaf_node_id, j = 0; i > 1; i = Math.floor(i / 2)) {
            this.nodes[Math.floor(i / 2)] = this.hash_(
                [
                    [this.nodes[i], prf[j]],
                    [prf[j], this.nodes[i]],
                ][i % 2]
            )
            ++j
        }
        return prf
    }
}
