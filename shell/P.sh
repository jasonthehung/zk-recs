start=$(date +%s)
filename=$(date "+%Y%m%d")

if [ -f "./test/circuits/$1/$1_setup/$1_final.zkey" ]; then
    cd ./test/circuits/$1/
    [ ! -f $1_setup ] && mkdir -p $1_setup
    [ ! -f $1_proof ] && mkdir -p $1_proof
    [ ! -f $1_proof/"$filename"_$1_soliditycalldata.json ] && touch $1_proof/"$filename"_$1_soliditycalldata.json

    node $1_js/generate_witness.js $1_js/$1.wasm ../../../inputs/$2.json $1_witness.wtns
    snarkjs groth16 prove $1_setup/$1_final.zkey $1_witness.wtns $1_proof/"$filename"_$1_proof.json $1_proof/"$filename"_$1_public.json
    snarkjs zkey export soliditycalldata $1_proof/"$filename"_$1_public.json $1_proof/"$filename"_$1_proof.json >$1_proof/"$filename"_$1_soliditycalldata.json
    cat $1_proof/"$filename"_$1_soliditycalldata.json
    cd ../../../

else
    echo "$path$1_final.zkey not found."
fi

end=$(date +%s)
time=$(echo $start $end | awk '{print $2-$1}')
d=$(date "+%Y-%m-%d")

[ ! -f ./log/"$filename"_"$1"_P.txt ] && touch ./log/"$filename"_"$1"_P.txt
echo "[$d] $1 P: $time s" >./log/"$filename"_"$1"_P.txt
