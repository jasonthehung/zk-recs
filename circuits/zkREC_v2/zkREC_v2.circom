pragma circom 2.1.0;

include "../../node_modules/circomlib/circuits/eddsaposeidon.circom";
include "../../node_modules/circomlib/circuits/babyjub.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../mktPoseidon/mktPoseidon.circom";

template ZkREC_v2(treeHeight, count) {
    signal input enabled;

    signal input Ax[count];
    signal input Ay[count];
    signal input R8x[count];
    signal input R8y[count];
    signal input S[count];
    signal input M[count];

    signal input deviceIndex[count];
    signal input merkleProof[count][treeHeight];

    signal input oriLeaf[count][6];
    signal input newLeaf[count][6];

    signal input oriRoot[count];
    signal input newRoot[count];

    signal output owner;
    var cur;
    signal output kw;

    component verifySig[count];

    for(var i = 0; i < count; i++) {
        verifySig[i] = EdDSAPoseidonVerifier();

        verifySig[i].enabled <== 1 ;
        verifySig[i].Ax <== Ax[i];
        verifySig[i].Ay <== Ay[i];
        verifySig[i].S <== S[i];
        verifySig[i].R8x <== R8x[i];
        verifySig[i].R8y <== R8y[i];
        verifySig[i].M <== M[i];

        VerifyExists(treeHeight)(deviceIndex[i], Poseidon(6)([oriLeaf[i][0],oriLeaf[i][1],oriLeaf[i][2],oriLeaf[i][3],oriLeaf[i][4],oriLeaf[i][5]]), merkleProof[i], oriRoot[i]);

        // 因為沒有更改owner, 所以owner不變
        newLeaf[i][0] === oriLeaf[i][0];
        // 因為device沒有更改, 所以device ID不變
        newLeaf[i][1] === oriLeaf[i][1];
        // nonce要 +1
        newLeaf[i][2] === (oriLeaf[i][2] + 1);
        // 新的totalKW = 舊的totalKW + msg (KW)
        newLeaf[i][3] === oriLeaf[i][3] + M[i];
        // Pub X不變
        newLeaf[i][4] === oriLeaf[i][4];
        // Pub Y不變
        newLeaf[i][5] === oriLeaf[i][5];
        
        VerifyExists(treeHeight)(deviceIndex[i], Poseidon(6)([newLeaf[i][0],newLeaf[i][1],newLeaf[i][2],newLeaf[i][3],newLeaf[i][4],newLeaf[i][5]]), merkleProof[i], newRoot[i]);

        cur = cur + M[i];
    }
    kw <== cur;
    owner <== oriLeaf[0][0];
}



// function LenOfSig(){
//     return 3;
// }

// function LenOfMKP(tree_height){
//     return 1 + 1 + tree_height;
// }

// template Sig(){
//     signal input arr[LenOfSig()];
//     signal output (RX, RY, S) <== (arr[0], arr[1], arr[2]);
// }

// template Sig_Verify(){
//     signal input sig[LenOfSig()], enabled, digest, pubKeyX, pubKeyY;
//     signal (RX, RY, S) <== Sig()(sig);
//     EdDSAPoseidonVerifier()(enabled, pubKeyX, pubKeyY, S, RX, RY, digest);
// }

// template MKP(tree_height){
//     signal input arr[LenOfMKP(tree_height)];
//     signal output (root, leafId) <== (arr[0], arr[1]);
//     signal output prf[tree_height];
//     for(var i = 0; i < tree_height; i++)
//         prf[i] <== arr[2 + i];
// }

// template MKP_Verify(tree_height){
//     signal input mkp[LenOfMKP(tree_height)], leafNode;
//     component mkp_ = MKP(tree_height);
//     mkp_.arr <== mkp;
//     VerifyExists(tree_height)(mkp_.leafId, leafNode, mkp_.prf, mkp_.root);
// }



