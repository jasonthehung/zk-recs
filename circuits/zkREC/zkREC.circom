pragma circom 2.1.0;

include "../../node_modules/circomlib/circuits/eddsaposeidon.circom";
include "../../node_modules/circomlib/circuits/babyjub.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../mktPoseidon/mktPoseidon.circom";

template ZkREC(deviceTreeHeight, numberOfDevice) {
    signal input enabled;

    signal input Ax[numberOfDevice];
    signal input Ay[numberOfDevice];
    signal input R8x[numberOfDevice];
    signal input R8y[numberOfDevice];
    signal input S[numberOfDevice];
    signal input M[numberOfDevice];

    signal input deviceIndex[numberOfDevice];
    signal input merkleProof[numberOfDevice][deviceTreeHeight];

    signal input oriLeaf[numberOfDevice][6];
    signal input newLeaf[numberOfDevice][6];

    signal input oriRoot[numberOfDevice];
    signal input newRoot[numberOfDevice];

    signal output owner;
    var cur;
    signal output kw;

    component verifySig[numberOfDevice];

    for(var i = 0; i < numberOfDevice; i++) {
        verifySig[i] = EdDSAPoseidonVerifier();

        verifySig[i].enabled <== 1 ;
        verifySig[i].Ax <== Ax[i];
        verifySig[i].Ay <== Ay[i];
        verifySig[i].S <== S[i];
        verifySig[i].R8x <== R8x[i];
        verifySig[i].R8y <== R8y[i];
        verifySig[i].M <== M[i];

        VerifyExists(deviceTreeHeight)(deviceIndex[i], Poseidon(6)([oriLeaf[i][0],oriLeaf[i][1],oriLeaf[i][2],oriLeaf[i][3],oriLeaf[i][4],oriLeaf[i][5]]), merkleProof[i], oriRoot[i]);

        // 因為沒有更改owner, 所以owner不變
        newLeaf[i][0] === oriLeaf[i][0];
        // 因為device沒有更改, 所以device ID不變
        newLeaf[i][1] === oriLeaf[i][1];
        // nonce要 +1
        newLeaf[i][2] === (oriLeaf[i][1] + 1);
        // 新的totalKW = 舊的totalKW + msg (KW)
        newLeaf[i][3] === oriLeaf[i][3] + M[i];
        // Pub X不變
        newLeaf[i][4] === oriLeaf[i][4];
        // Pub Y不變
        newLeaf[i][5] === oriLeaf[i][5];
        
        VerifyExists(deviceTreeHeight)(deviceIndex[i], Poseidon(6)([newLeaf[i][0],newLeaf[i][1],newLeaf[i][2],newLeaf[i][3],newLeaf[i][4],newLeaf[i][5]]), merkleProof[i], newRoot[i]);

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



