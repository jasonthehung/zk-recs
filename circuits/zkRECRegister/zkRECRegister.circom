pragma circom 2.1.0;

include "../../node_modules/circomlib/circuits/eddsaposeidon.circom";
include "../../node_modules/circomlib/circuits/babyjub.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../mktPoseidon/mktPoseidon.circom";

function LenOfSig(){
    return 3;
}

function LenOfMKP(tree_height){
    return 1 + 1 + tree_height;
}

template Sig(){
    signal input arr[LenOfSig()];
    signal output (RX, RY, S) <== (arr[0], arr[1], arr[2]);
}

template Sig_Verify(){
    signal input sig[LenOfSig()], enabled, digest, pubKeyX, pubKeyY;
    signal (RX, RY, S) <== Sig()(sig);
    EdDSAPoseidonVerifier()(enabled, pubKeyX, pubKeyY, S, RX, RY, digest);
}

template MKP(tree_height){
    signal input arr[LenOfMKP(tree_height)];
    signal output (root, leafId) <== (arr[0], arr[1]);
    signal output prf[tree_height];
    for(var i = 0; i < tree_height; i++)
        prf[i] <== arr[2 + i];
}

template MKP_Verify(tree_height){
    signal input mkp[LenOfMKP(tree_height)], leafNode;
    component mkp_ = MKP(tree_height);
    mkp_.arr <== mkp;
    VerifyExists(tree_height)(mkp_.leafId, leafNode, mkp_.prf, mkp_.root);
}



template ZkRECRegister(deviceTreeHeight, deviceAmt) {
    signal input deviceIndex[deviceAmt];
    signal input merkleProof[deviceAmt][deviceTreeHeight];

    signal input oriLeaf[deviceAmt][6];
    signal input newLeaf[deviceAmt][6];

    signal input oriRoot[deviceAmt];
    signal input newRoot[deviceAmt];


    for(var i = 0; i < deviceAmt; i++) {
        VerifyExists(deviceTreeHeight)(deviceIndex[i], Poseidon(6)([oriLeaf[i][0],oriLeaf[i][1],oriLeaf[i][2],oriLeaf[i][3],oriLeaf[i][4],oriLeaf[i][5]]), merkleProof[i], oriRoot[i]);
        VerifyExists(deviceTreeHeight)(deviceIndex[i], Poseidon(6)([newLeaf[i][0],newLeaf[i][1],newLeaf[i][2],newLeaf[i][3],newLeaf[i][4],newLeaf[i][5]]), merkleProof[i], newRoot[i]);
    }
    

    // leaf[0][] === leaf[1][]
    // leaf[0][] === leaf[1][]
    // leaf[0][] === leaf[1][]
    // leaf[0][] === leaf[1][]
    // leaf[0][] === leaf[1][]
}

