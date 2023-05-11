start=$(date +%s)

if [ -f "./test/circuits/$1/$1.r1cs" ]; then
    cd ./test/circuits/$1
    [ ! -f $1_setup ] && mkdir -p $1_setup
    [ ! -f $1_sol ] && mkdir -p $1_sol

    snarkjs groth16 setup $1.r1cs ../../../ptau/final_21.ptau $1_setup/$1_0000.zkey
    snarkjs zkey contribute $1_setup/$1_0000.zkey $1_setup/$1_0001.zkey --name="1st Contributor Name" -v -e="Another"
    snarkjs zkey contribute $1_setup/$1_0001.zkey $1_setup/$1_0002.zkey --name="Second contribution Name" -v -e="Another random entropy"
    snarkjs zkey export bellman $1_setup/$1_0002.zkey $1_setup/challenge_phase2_0003
    snarkjs zkey bellman contribute bn128 $1_setup/challenge_phase2_0003 $1_setup/response_phase2_0003 -e="some random text"
    snarkjs zkey import bellman $1_setup/$1_0002.zkey $1_setup/response_phase2_0003 $1_setup/$1_0003.zkey -n="Third contribution name"
    snarkjs zkey beacon $1_setup/$1_0003.zkey $1_setup/$1_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"
    snarkjs zkey export verificationkey $1_setup/$1_final.zkey verification_key.json
    snarkjs zkey export solidityverifier $1_setup/$1_final.zkey $1_sol/$1_verifier.sol
    cd ../../../

else
    echo "$path$1.r1cs not found."
fi

end=$(date +%s)
time=$(echo $start $end | awk '{print $2-$1}')
d=$(date "+%Y-%m-%d %H:%M:%S")
filename=$(date "+%Y%m%d%H%M%S")

[ ! -f ./log/"$filename"_"$1"_G.txt ] && touch ./log/"$filename"_"$1"_G.txt
echo "[$d] $1 G: $time s" >./log/"$filename"_"$1"_G.txt

exit 0
