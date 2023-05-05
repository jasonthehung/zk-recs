start=$(date +%s)

if [ -f "./test/circuits/$1/$1.circom" ]; then
    cd ./test/circuits/$1
    circom "$1".circom --wasm --r1cs --sym
    cd ../../../
else
    echo "$path$1.circom not found."
fi
end=$(date +%s)
time=$(echo $start $end | awk '{print $2-$1}')
d=$(date "+%Y-%m-%d %H:%M:%S")
filename=$(date "+%Y%m%d%H%M%S")

[ ! -f ./log/"$filename"_"$1"_build.txt ] && touch ./log/"$filename"_"$1"_build.txt
echo "[$d] $1 build: $time s" >./log/"$filename"_"$1"_build.txt

exit 0
