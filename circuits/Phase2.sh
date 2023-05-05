snarkjs powersoftau prepare phase2 eddsaposeidon_16_0001.ptau eddsaposeidon_16_final.ptau -v

snarkjs groth16 setup eddsaposeidon.r1cs eddsaposeidon_16_final.ptau eddsaposeidon_0000.zkey

snarkjs zkey contribute eddsaposeidon_0000.zkey eddsaposeidon_0001.zkey --name="1st Contributor Name Jason" -v

snarkjs zkey export verificationkey eddsaposeidon_0001.zkey verification_key.json
