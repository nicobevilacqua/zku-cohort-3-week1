const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");

function unstringifyBigInts(o) {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (typeof o == "string" && /^0x[0-9a-fA-F]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    if (o === null) return null;
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

describe("RangeProof", () => {
  let contract;
  before(async () => {
    const Factory = await ethers.getContractFactory("RangeProofVerifier");
    contract = await Factory.deploy();
    await contract.deployed();
  });

  it("Should return true for correct proof", async () => {
    const { proof, publicSignals } = await groth16.fullProve(
      { in: 5, range: [1, 20] },
      "contracts/circuits/RangeProof/RangeProof_js/RangeProof.wasm",
      "contracts/circuits/RangeProof/circuit_final.zkey"
    );

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );

    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    expect(await contract.verifyProof(a, b, c, Input)).to.be.true;
  });

  it("Should return false for incorrect proof", async () => {
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let d = [0];
    expect(await contract.verifyProof(a, b, c, d)).to.be.false;
  });
});
