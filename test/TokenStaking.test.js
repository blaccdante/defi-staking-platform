const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeFi Staking Platform", function () {
  let stakingToken, rewardToken, tokenStaking;
  let owner, user1, user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy tokens
    const StakingToken = await ethers.getContractFactory("StakingToken");
    stakingToken = await StakingToken.deploy("Staking Token", "STK", 1000000);

    const RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy("Reward Token", "RWD", 10000000);

    // Deploy staking contract
    const TokenStaking = await ethers.getContractFactory("TokenStaking");
    tokenStaking = await TokenStaking.deploy(
      await stakingToken.getAddress(),
      await rewardToken.getAddress()
    );

    // Transfer reward tokens to staking contract
    await rewardToken.transfer(
      await tokenStaking.getAddress(),
      ethers.parseEther("5000000")
    );

    // Mint tokens to users for testing
    await stakingToken.mint(user1.address, ethers.parseEther("1000"));
    await stakingToken.mint(user2.address, ethers.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the right token addresses", async function () {
      expect(await tokenStaking.stakingToken()).to.equal(await stakingToken.getAddress());
      expect(await tokenStaking.rewardToken()).to.equal(await rewardToken.getAddress());
    });

    it("Should set the correct reward rate", async function () {
      expect(await tokenStaking.rewardRate()).to.equal(100);
    });

    it("Should mint tokens to users", async function () {
      expect(await stakingToken.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
      expect(await stakingToken.balanceOf(user2.address)).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      // Approve and stake
      await stakingToken.connect(user1).approve(await tokenStaking.getAddress(), stakeAmount);
      await tokenStaking.connect(user1).stake(stakeAmount);

      expect(await tokenStaking.stakedBalance(user1.address)).to.equal(stakeAmount);
      expect(await tokenStaking.totalStaked()).to.equal(stakeAmount);
    });

    it("Should not allow staking 0 tokens", async function () {
      await expect(
        tokenStaking.connect(user1).stake(0)
      ).to.be.revertedWith("Cannot stake 0 tokens");
    });

    it("Should require approval before staking", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      await expect(
        tokenStaking.connect(user1).stake(stakeAmount)
      ).to.be.reverted; // Should fail without approval
    });
  });

  describe("Rewards", function () {
    it("Should accumulate rewards over time", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      // Stake tokens
      await stakingToken.connect(user1).approve(await tokenStaking.getAddress(), stakeAmount);
      await tokenStaking.connect(user1).stake(stakeAmount);

      // Move forward in time (simulate)
      await ethers.provider.send("evm_increaseTime", [60]); // 60 seconds
      await ethers.provider.send("evm_mine"); // Mine a block

      const earnedRewards = await tokenStaking.earned(user1.address);
      expect(earnedRewards).to.be.gt(0);
    });

    it("Should allow claiming rewards", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      // Stake and wait
      await stakingToken.connect(user1).approve(await tokenStaking.getAddress(), stakeAmount);
      await tokenStaking.connect(user1).stake(stakeAmount);
      
      await ethers.provider.send("evm_increaseTime", [60]);
      await ethers.provider.send("evm_mine");

      const initialRewardBalance = await rewardToken.balanceOf(user1.address);
      await tokenStaking.connect(user1).claimReward();
      const finalRewardBalance = await rewardToken.balanceOf(user1.address);

      expect(finalRewardBalance).to.be.gt(initialRewardBalance);
    });
  });

  describe("Withdrawal", function () {
    it("Should not allow withdrawal before minimum period", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      await stakingToken.connect(user1).approve(await tokenStaking.getAddress(), stakeAmount);
      await tokenStaking.connect(user1).stake(stakeAmount);

      await expect(
        tokenStaking.connect(user1).withdraw(stakeAmount)
      ).to.be.revertedWith("Minimum staking period not met");
    });

    it("Should allow withdrawal after minimum period", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      await stakingToken.connect(user1).approve(await tokenStaking.getAddress(), stakeAmount);
      await tokenStaking.connect(user1).stake(stakeAmount);

      // Fast forward 7 days
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      const initialBalance = await stakingToken.balanceOf(user1.address);
      await tokenStaking.connect(user1).withdraw(stakeAmount);
      const finalBalance = await stakingToken.balanceOf(user1.address);

      expect(finalBalance).to.equal(initialBalance + stakeAmount);
      expect(await tokenStaking.stakedBalance(user1.address)).to.equal(0);
    });
  });

  describe("Exit function", function () {
    it("Should withdraw all tokens and claim rewards", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      await stakingToken.connect(user1).approve(await tokenStaking.getAddress(), stakeAmount);
      await tokenStaking.connect(user1).stake(stakeAmount);

      // Fast forward 7 days to allow withdrawal
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      const initialStakingBalance = await stakingToken.balanceOf(user1.address);
      const initialRewardBalance = await rewardToken.balanceOf(user1.address);

      await tokenStaking.connect(user1).exit();

      const finalStakingBalance = await stakingToken.balanceOf(user1.address);
      const finalRewardBalance = await rewardToken.balanceOf(user1.address);

      expect(finalStakingBalance).to.be.gt(initialStakingBalance);
      expect(finalRewardBalance).to.be.gt(initialRewardBalance);
      expect(await tokenStaking.stakedBalance(user1.address)).to.equal(0);
    });
  });
});