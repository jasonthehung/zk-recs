pragma circom 2.1.0;

include "../../node_modules/circomlib/circuits/babyjub.circom";

template test() {
    signal input a,b,c;
    
    signal (temp0, temp1) <== BabyPbk()(a);

    temp0 === b;
    temp1 === c;
}

component main = test();