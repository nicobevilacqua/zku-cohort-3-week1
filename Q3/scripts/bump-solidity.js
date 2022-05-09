const fs = require("fs");

const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/;

function bumpContract({ name, file, plonk }) {
  let verifierRegex = /contract Verifier/;
  if (plonk) {
    verifierRegex = /contract PlonkVerifier/;
  }

  const path = `./contracts/${file}`;

  const content = fs.readFileSync(path, {
    encoding: "utf-8",
  });

  let bumped = content.replace(solidityRegex, "pragma solidity ^0.8.0");
  bumped = bumped.replace(verifierRegex, `contract ${name}`);

  fs.writeFileSync(path, bumped);
}

bumpContract({
  name: "RangeProofImplementationVerifier",
  file: "RangeProofImplementationVerifier.sol",
});

