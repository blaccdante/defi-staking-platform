const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy Staking Token
  console.log("\nDeploying Staking Token...");
  const StakingToken = await ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy(
    "Staking Token", 
    "STK", 
    1000000 // 1 million initial supply
  );
  await stakingToken.waitForDeployment();
  const stakingTokenAddress = await stakingToken.getAddress();
  console.log("Staking Token deployed to:", stakingTokenAddress);

  // Deploy Reward Token
  console.log("\nDeploying Reward Token...");
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(
    "Reward Token", 
    "RWD", 
    10000000 // 10 million initial supply for rewards
  );
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("Reward Token deployed to:", rewardTokenAddress);

  // Deploy Staking Contract
  console.log("\nDeploying Token Staking Contract...");
  const TokenStaking = await ethers.getContractFactory("TokenStaking");
  const tokenStaking = await TokenStaking.deploy(
    stakingTokenAddress,
    rewardTokenAddress
  );
  await tokenStaking.waitForDeployment();
  const tokenStakingAddress = await tokenStaking.getAddress();
  console.log("Token Staking Contract deployed to:", tokenStakingAddress);

  // Transfer reward tokens to staking contract
  console.log("\nTransferring reward tokens to staking contract...");
  const rewardAmount = ethers.parseEther("5000000"); // 5 million tokens for rewards
  await rewardToken.transfer(tokenStakingAddress, rewardAmount);
  console.log("Transferred 5M reward tokens to staking contract");

  // Mint some staking tokens to deployer for testing
  console.log("\nMinting additional staking tokens for testing...");
  const mintAmount = ethers.parseEther("100000"); // 100k tokens for testing
  await stakingToken.mint(deployer.address, mintAmount);
  console.log("Minted 100k additional staking tokens to deployer");

  console.log("\n=== Deployment Summary ===");
  console.log("Staking Token:", stakingTokenAddress);
  console.log("Reward Token:", rewardTokenAddress);
  console.log("Token Staking:", tokenStakingAddress);
  console.log("Deployer Address:", deployer.address);

  // Save deployment info to file
  const deploymentInfo = {
    network: "localhost",
    deployer: deployer.address,
    contracts: {
      StakingToken: stakingTokenAddress,
      RewardToken: rewardTokenAddress,
      TokenStaking: tokenStakingAddress
    },
    deploymentTime: new Date().toISOString()
  };

  const fs = require('fs');
  fs.writeFileSync(
    './deployments.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });