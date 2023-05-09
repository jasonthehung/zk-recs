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

template ZkREC(device_tree_height) {
    signal input enabled;
    signal input Ax;
    signal input Ay;
    signal input S;
    signal input R8x;
    signal input R8y;
    signal input M;

    signal input idx;
    signal input leaf_node;
    signal input merkle_proof[device_tree_height];
    signal input merkle_root;


    EdDSAPoseidonVerifier()(1, Ax, Ay, S, R8x, R8y, M);
    VerifyExists(device_tree_height)(idx, leaf_node, merkle_proof, merkle_root);
}

