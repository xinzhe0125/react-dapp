// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  // We get the contract to deploy
  //const Greeter = await hre.ethers.getContractFactory("Greeter");
  //const greeter = await Greeter.deploy("Hello, Hardhat!");

  //const Token = await hre.ethers.getContractFactory("Token");
  //const token = await Token.deploy();

  const Ballot = await hre.ethers.getContractFactory("Ballot");
  const proposalArray = ["Raise wage", "Increase polices", 
                        "Decrease tax", "Increase jobs"];
  const proposalByteArray = proposalArray.map(
    x => convertStringToByte32(x)
  );

  const ballot = await Ballot.deploy(proposalByteArray);

  //await greeter.deployed();
  //await token.deployed();
  await ballot.deployed();

  //console.log("Greeter deployed to:", greeter.address);
  //console.log("Token deployed to:", token.address);
  console.log("Ballot deployed to:", ballot.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/// convert stringValue into byte32 format string
function convertStringToByte32(stringValue) {

  const defaultReturnValue = "0x0000000000000000000000000000000000000000000000000000000000000000"
  if (!stringValue) {
    return defaultReturnValue;
  }

  // Split each character and convert it to 16-base string
  // and join them
  let wholeHexString = "";
  for (let i = 0; i < stringValue.length; i+=1) {
    let character = stringValue.substr(i, 1);
    let hexString = character.charCodeAt(0).toString(16);
    if (hexString.length == 1) {
      hexString = "0" + hexString;
    }
    wholeHexString += hexString;
  }

  // padding joinned hex string on the right
  for (let i = wholeHexString.length; i < 64; i+=2) {
    wholeHexString += "00";
  }

  // add 0x to the hex string on the left and return
  return "0x" + wholeHexString;
}