zk-recs

Paper link: to be continued...

Note: To execute the G algorithm, you need to first download the .ptau file from the snarkjs GitHub. This circuit requires at least the ptau 23 .ptau file. After downloading, rename the file to final_23.ptau and place it in the ptau directory.
Folders
Circuits folder

    All the circuit codes used.

src folder

    Backend server code.

lib folder

    Source code library.

inputs folder

    Parameters produced by the backend server, used as inputs for the P algorithm.

shell folder

    Simplifies snarkjs's complex commands.

test folder

    deviceTreeManager.test.ts contains multiple unit tests. The testing process simulates the backend server's data collection and generates inputs for the P algorithm (inputs will be stored in the inputs folder).
    Other folders in the test folder are used to store proof, V algorithm smart contracts, and other data.
    Parameters (i.e., proof) to be sent to the V algorithm are stored in test/circuits/zkREC_v2_test & Tree Height & Verifiable Groups/zkREC_v2_test & proof/Date & zkREC_v2_test.soliditycalldata.json.
    The V algorithm smart contract is located in test/circuits/zkREC_v2_test & Tree Height & Verifiable Groups/zkREC_v2_test & sol/zkREC_v2_test_verifier.sol.

Actual Execution

    In the test/circuits folder, create a new folder named zkREC_v2_test_Custom Tree Height_Custom Verifiable Groups.

    Inside the newly created folder, add zkREC_v2_test.circom.

    Copy and paste the following code into the .circom file (ensure that you have installed circom version 2.1.0 or higher):

pragma circom 2.1.0;

include "../../../circuits/zkREC_v2/zkREC_v2.circom";

component main = ZkREC_v2(Custom Tree Height, Custom Verifiable Groups);

Use shell/build.sh to process the files required for the G algorithm.

Use shell/G.sh to perform the G algorithm calculation. This process may require a significant amount of computational time, so it's recommended to reduce the "Verifiable Groups" to shorten the computation time.

Generate the necessary inputs through deviceTreeManager.test.ts.

Use shell/P.sh to send the inputs to the P algorithm to generate proof.

Use shell/V.sh to validate the proof off-chain. Check if the proof is correct; if the return is true, it means that the steps in deviceTreeManager.test.ts have passed the circuit check and generated a proof that can be verified by others.
