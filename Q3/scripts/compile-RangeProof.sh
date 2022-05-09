#!/bin/bash

cd contracts/circuits

mkdir RangeProofImplementation

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling RangeProofImplementation.circom..."

# compile circuit

circom RangeProofImplementation.circom --r1cs --wasm --sym -o RangeProofImplementation
snarkjs r1cs info RangeProofImplementation/RangeProofImplementation.r1cs

# Start a new zkey and make a contribution

# create the initial zkey file without any contribution yet
snarkjs groth16 setup RangeProofImplementation/RangeProofImplementation.r1cs powersOfTau28_hez_final_10.ptau RangeProofImplementation/circuit_0000.zkey
# just one contribution for phase 2
snarkjs zkey contribute RangeProofImplementation/circuit_0000.zkey RangeProofImplementation/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
# export the zkey file to json in order to use it
snarkjs zkey export verificationkey RangeProofImplementation/circuit_final.zkey RangeProofImplementation/verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier RangeProofImplementation/circuit_final.zkey ../RangeProofImplementationVerifier.sol

cd ../..