export class Signature {
    // follow EdDSA poseidon SPEC.
    constructor(
        public R8x: bigint = 0n,
        public R8y: bigint = 0n,
        public S: bigint = 0n
    ) {}
}
