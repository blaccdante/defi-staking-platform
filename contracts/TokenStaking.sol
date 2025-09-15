// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenStaking
 * @dev A DeFi staking contract where users can stake tokens and earn rewards
 */
contract TokenStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // State variables
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;
    
    uint256 public rewardRate = 100; // 100 reward tokens per second per staked token
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalStaked;
    
    // Minimum staking period (7 days)
    uint256 public constant MINIMUM_STAKING_PERIOD = 7 days;
    
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingTimestamp;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    constructor(
        address _stakingToken,
        address _rewardToken
    ) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        lastUpdateTime = block.timestamp;
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /**
     * @dev Calculate reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        
        return rewardPerTokenStored + 
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalStaked);
    }

    /**
     * @dev Calculate earned rewards for an account
     */
    function earned(address account) public view returns (uint256) {
        return (stakedBalance[account] * 
            (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18) + 
            rewards[account];
    }

    /**
     * @dev Stake tokens
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) 
        external 
        nonReentrant 
        updateReward(msg.sender) 
    {
        require(amount > 0, "Cannot stake 0 tokens");
        
        totalStaked += amount;
        stakedBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Withdraw staked tokens
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) 
        external 
        nonReentrant 
        updateReward(msg.sender) 
    {
        require(amount > 0, "Cannot withdraw 0 tokens");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        require(
            block.timestamp >= stakingTimestamp[msg.sender] + MINIMUM_STAKING_PERIOD,
            "Minimum staking period not met"
        );
        
        totalStaked -= amount;
        stakedBalance[msg.sender] -= amount;
        
        stakingToken.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Claim accumulated rewards
     */
    function claimReward() 
        external 
        nonReentrant 
        updateReward(msg.sender) 
    {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards available");
        
        rewards[msg.sender] = 0;
        rewardToken.safeTransfer(msg.sender, reward);
        
        emit RewardPaid(msg.sender, reward);
    }

    /**
     * @dev Exit staking (withdraw all and claim rewards)
     */
    function exit() external nonReentrant updateReward(msg.sender) {
        uint256 stakedAmount = stakedBalance[msg.sender];
        uint256 reward = rewards[msg.sender];
        
        require(stakedAmount > 0, "No tokens staked");
        require(
            block.timestamp >= stakingTimestamp[msg.sender] + MINIMUM_STAKING_PERIOD,
            "Minimum staking period not met"
        );
        
        // Withdraw all staked tokens
        totalStaked -= stakedAmount;
        stakedBalance[msg.sender] = 0;
        stakingToken.safeTransfer(msg.sender, stakedAmount);
        emit Withdrawn(msg.sender, stakedAmount);
        
        // Claim all rewards if any
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    /**
     * @dev Get staking info for an account
     */
    function getStakingInfo(address account) 
        external 
        view 
        returns (
            uint256 staked,
            uint256 earned_,
            uint256 stakingTime,
            bool canWithdraw
        ) 
    {
        staked = stakedBalance[account];
        earned_ = earned(account);
        stakingTime = stakingTimestamp[account];
        canWithdraw = block.timestamp >= stakingTime + MINIMUM_STAKING_PERIOD;
    }

    /**
     * @dev Update reward rate (only owner)
     */
    function updateRewardRate(uint256 _rewardRate) 
        external 
        onlyOwner 
        updateReward(address(0)) 
    {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }

    /**
     * @dev Emergency function to recover tokens (only owner)
     */
    function recoverERC20(address tokenAddress, uint256 tokenAmount) 
        external 
        onlyOwner 
    {
        require(
            tokenAddress != address(stakingToken) && 
            tokenAddress != address(rewardToken), 
            "Cannot withdraw staking or reward tokens"
        );
        IERC20(tokenAddress).safeTransfer(owner(), tokenAmount);
    }
}