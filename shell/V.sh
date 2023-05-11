start=$(date +%s)
filename=$(date "+%Y%m%d")

snarkjs groth16 verify ./test/circuits/$1/verification_key.json ./test/circuits/$1/$1_proof/$2_$1_public.json ./test/circuits/$1/$1_proof/$2_$1_proof.json

end=$(date +%s)
time=$(echo $start $end | awk '{print $2-$1}')
d=$(date "+%Y-%m-%d")

[ ! -f ./log/"$filename"_"$1"_V.txt ] && touch ./log/"$filename"_"$1"_V.txt
echo "[$d] $1 V: $time s" >./log/"$filename"_"$1"_V.txt
