# 🚀 DeFi Staking Platform

A decentralized finance (DeFi) token staking platform built with React, Hardhat, and Solidity. Users can stake tokens to earn rewards over time with a built-in lockup period for security.

[![GitHub Stars](https://img.shields.io/github/stars/blaccdante/defi-staking-platform?style=social)](https://github.com/blaccdante/defi-staking-platform/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/blaccdante/defi-staking-platform?style=social)](https://github.com/blaccdante/defi-staking-platform/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/blaccdante/defi-staking-platform)](https://github.com/blaccdante/defi-staking-platform/issues)
[![License](https://img.shields.io/github/license/blaccdante/defi-staking-platform)](https://github.com/blaccdante/defi-staking-platform/blob/main/LICENSE)

![DeFi Staking Platform](https://img.shields.io/badge/DeFi-Staking-blue) ![React](https://img.shields.io/badge/React-18.2-blue) ![Solidity](https://img.shields.io/badge/Solidity-0.8.20-green) ![Hardhat](https://img.shields.io/badge/Hardhat-2.19-orange)

## ✨ Features

### Smart Contracts
- **ERC20 Staking Token (STK)** - Token users can stake
- **ERC20 Reward Token (RWD)** - Token distributed as rewards  
- **TokenStaking Contract** - Main staking logic with:
  - Stake tokens to earn rewards
  - Time-based reward calculation (100 RWD per second per staked STK)
  - 7-day minimum staking period before withdrawal
  - Claim rewards functionality
  - Exit function (withdraw all + claim rewards)
  - Emergency recovery functions (owner only)

### Frontend
- **Modern React Interface** - Clean, responsive design with glass morphism effects
- **MetaMask Integration** - Connect wallet with automatic account detection
- **Real-time Stats** - Live display of staking stats and rewards
- **Transaction Handling** - Loading states and success/error notifications
- **Mobile Responsive** - Works on desktop and mobile devices

### Security Features
- **ReentrancyGuard** - Prevents reentrancy attacks
- **SafeERC20** - Safe token transfers
- **Minimum Staking Period** - 7-day lockup prevents flash loan attacks
- **Ownable** - Owner-only administrative functions

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, ethers.js v6
- **Smart Contracts**: Solidity 0.8.19, OpenZeppelin
- **Development**: Hardhat, JavaScript
- **Styling**: CSS with custom gradients and animations

## 📋 Prerequisites

- Node.js 16+ and npm
- MetaMask browser extension
- Git

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/blaccdante/defi-staking-platform.git
cd defi-staking-platform
npm install
```

### 2. Start Local Blockchain
```bash
# Terminal 1 - Start Hardhat node
npm run node
```

### 3. Deploy Contracts
```bash
# Terminal 2 - Deploy contracts
npm run deploy:local
```

### 4. Start Frontend
```bash
# Terminal 3 - Start React app
npm run dev
```

### 5. Configure MetaMask
1. Add local network to MetaMask:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

2. Import a test account using one of the private keys from Hardhat node output

### 6. Get Test Tokens
The deployment script automatically:
- Mints 1M STK tokens to deployer
- Mints 10M RWD tokens for rewards  
- Transfers 5M RWD to staking contract
- Mints additional 100k STK for testing

## 📖 How to Use

### For Users

1. **Connect Wallet**
   - Click "Connect MetaMask" 
   - Approve the connection

2. **Stake Tokens**
   - Enter amount of STK to stake
   - Approve token spending (first time)
   - Confirm staking transaction
   - Tokens are locked for 7 days minimum

3. **Monitor Rewards**
   - View real-time reward accumulation
   - Rewards accrue at 100 RWD per second per staked STK
   - Stats update every 10 seconds

4. **Claim Rewards**
   - Click "Claim Rewards" to collect RWD tokens
   - Rewards can be claimed anytime without unstaking

5. **Withdraw Tokens**
   - Wait 7 days after staking
   - Enter amount to withdraw (up to staked balance)
   - Confirm withdrawal transaction

6. **Exit (Advanced)**
   - Withdraws all staked tokens AND claims all rewards
   - Only available after 7-day minimum period

### For Developers

#### Contract Addresses
After deployment, contract addresses are saved to `deployments.json`:
```json
{
  "network": "localhost", 
  "deployer": "0x...",
  "contracts": {
    "StakingToken": "0x...",
    "RewardToken": "0x...", 
    "TokenStaking": "0x..."
  }
}
```

#### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run compile      # Compile smart contracts
npm run test         # Run contract tests
npm run deploy:local # Deploy to localhost
npm run deploy:sepolia # Deploy to Sepolia testnet
npm run node         # Start Hardhat node
```

#### Environment Variables
Create `.env` file for mainnet/testnet deployment:
```
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
```

## 🏗 Architecture

### Smart Contract Flow
```
User → StakingToken.approve() → TokenStaking.stake()
     ↓
TokenStaking holds STK tokens & tracks rewards
     ↓  
User can claim RWD rewards anytime
     ↓
After 7 days: User can withdraw STK tokens
```

### Contract Functions

#### StakingToken.sol & RewardToken.sol
- `mint(address, uint256)` - Mint tokens (owner only)
- `transfer()`, `approve()` - Standard ERC20 functions

#### TokenStaking.sol
- `stake(uint256)` - Stake tokens to earn rewards
- `withdraw(uint256)` - Withdraw staked tokens (after 7 days)
- `claimReward()` - Claim accumulated rewards
- `exit()` - Withdraw all tokens + claim rewards
- `earned(address)` - View pending rewards
- `getStakingInfo(address)` - Get user's staking details

### Frontend Components

- `App.jsx` - Main component with wallet connection
- `WalletConnect.jsx` - MetaMask connection interface
- `StatsDisplay.jsx` - Real-time statistics display
- `StakingInterface.jsx` - Staking, withdrawing, claiming interface

## 🧪 Testing

### Manual Testing Checklist

1. **Wallet Connection**
   - [ ] Connect MetaMask successfully
   - [ ] Display correct account and network
   - [ ] Handle account switching
   - [ ] Disconnect wallet properly

2. **Staking Flow**
   - [ ] Approve tokens for staking
   - [ ] Stake tokens successfully
   - [ ] Display updated staked balance
   - [ ] Show 7-day countdown timer
   - [ ] Prevent withdrawal before 7 days

3. **Rewards System**
   - [ ] Rewards accumulate over time
   - [ ] Claim rewards without unstaking
   - [ ] Display updated reward balance
   - [ ] Multiple claim transactions work

4. **Withdrawal Flow**
   - [ ] Withdraw button disabled before 7 days
   - [ ] Partial withdrawal works
   - [ ] Full withdrawal works
   - [ ] Exit function (withdraw all + claim)

5. **Error Handling**
   - [ ] Invalid input amounts
   - [ ] Insufficient balance
   - [ ] Failed transactions
   - [ ] Network errors

### Test Scenarios

1. **Happy Path**: Stake → Wait → Claim → Withdraw
2. **Multiple Stakes**: Stake multiple times, rewards accumulate
3. **Edge Cases**: Stake 0.001 tokens, withdraw exact balance
4. **Time Testing**: Fast-forward time to test lockup period

## 🔒 Security Considerations

### Implemented Protections
- **Minimum Staking Period**: Prevents flash loan attacks
- **ReentrancyGuard**: Prevents reentrancy in all external calls
- **SafeERC20**: Safe token transfer operations  
- **Access Control**: Owner-only administrative functions
- **Input Validation**: Checks for valid amounts and states

### Additional Recommendations
- Audit smart contracts before mainnet deployment
- Implement emergency pause functionality
- Add governance for parameter updates
- Consider timelock for owner functions
- Monitor for MEV attacks

## 🚀 Deployment

### Localhost (Development)
```bash
npm run node     # Terminal 1
npm run deploy:local  # Terminal 2
npm run dev      # Terminal 3
```

### Testnet (Sepolia)
1. Get Sepolia ETH from faucet
2. Set up `.env` with your credentials
3. Deploy: `npm run deploy:sepolia`
4. Update frontend contract addresses

### Mainnet (Production)
⚠️ **Audit contracts first!**
1. Professional smart contract audit
2. Set up production environment variables
3. Deploy with proper gas settings
4. Verify contracts on Etherscan

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`  
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] Multiple staking pools with different APRs
- [ ] NFT rewards for long-term stakers  
- [ ] Governance token integration
- [ ] Flash loan-resistant improvements
- [ ] Mobile app with WalletConnect
- [ ] Multi-chain deployment (Polygon, BSC)
- [ ] Advanced analytics dashboard
- [ ] Automatic compounding option

## 📞 Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Check this README for common questions
- Community: Join our Discord (link coming soon)

---

**⚡ Happy Staking!** Built with ❤️ for the DeFi community.