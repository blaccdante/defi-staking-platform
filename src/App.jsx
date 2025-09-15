import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast, Toaster } from 'react-hot-toast'
import WalletConnect from './components/WalletConnect'
import StakingInterface from './components/StakingInterface'
import StatsDisplay from './components/StatsDisplay'
import './App.css'

function App() {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(null)
  const [contracts, setContracts] = useState(null)
  const [loading, setLoading] = useState(false)

  // Contract addresses (will be populated from deployments.json)
  const CONTRACT_ADDRESSES = {
    StakingToken: '',
    RewardToken: '',
    TokenStaking: ''
  }

  useEffect(() => {
    // Load contract addresses from deployment
    loadContractAddresses()
    
    // Check if wallet is already connected
    checkWalletConnection()
  }, [])

  const loadContractAddresses = async () => {
    try {
      const response = await fetch('/deployments.json')
      const deployments = await response.json()
      CONTRACT_ADDRESSES.StakingToken = deployments.contracts.StakingToken
      CONTRACT_ADDRESSES.RewardToken = deployments.contracts.RewardToken
      CONTRACT_ADDRESSES.TokenStaking = deployments.contracts.TokenStaking
    } catch (error) {
      console.log('No deployment file found, using default addresses')
    }
  }

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        })
        if (accounts.length > 0) {
          await connectWallet()
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed!')
      return
    }

    try {
      setLoading(true)
      
      // Request account access
      await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const web3Signer = await web3Provider.getSigner()
      const address = await web3Signer.getAddress()
      const network = await web3Provider.getNetwork()

      setProvider(web3Provider)
      setSigner(web3Signer)
      setAccount(address)
      setChainId(Number(network.chainId))

      // Load contracts
      await loadContracts(web3Provider, web3Signer)

      toast.success('Wallet connected successfully!')
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }

  const loadContracts = async (provider, signer) => {
    try {
      // Contract ABIs (simplified for demo)
      const ERC20_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 value) returns (bool)",
        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint256 value) returns (bool)",
        "function mint(address to, uint256 amount) returns (bool)"
      ]

      const STAKING_ABI = [
        "function stakingToken() view returns (address)",
        "function rewardToken() view returns (address)",
        "function totalStaked() view returns (uint256)",
        "function rewardRate() view returns (uint256)",
        "function stakedBalance(address account) view returns (uint256)",
        "function earned(address account) view returns (uint256)",
        "function getStakingInfo(address account) view returns (uint256, uint256, uint256, bool)",
        "function stake(uint256 amount) payable",
        "function withdraw(uint256 amount)",
        "function claimReward()",
        "function exit()",
        "event Staked(address indexed user, uint256 amount)",
        "event Withdrawn(address indexed user, uint256 amount)",
        "event RewardPaid(address indexed user, uint256 reward)"
      ]

      const stakingToken = new ethers.Contract(
        CONTRACT_ADDRESSES.StakingToken,
        ERC20_ABI,
        signer
      )

      const rewardToken = new ethers.Contract(
        CONTRACT_ADDRESSES.RewardToken,
        ERC20_ABI,
        signer
      )

      const tokenStaking = new ethers.Contract(
        CONTRACT_ADDRESSES.TokenStaking,
        STAKING_ABI,
        signer
      )

      setContracts({
        stakingToken,
        rewardToken,
        tokenStaking
      })
    } catch (error) {
      console.error('Error loading contracts:', error)
      toast.error('Failed to load contracts')
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAccount('')
    setChainId(null)
    setContracts(null)
    toast.success('Wallet disconnected')
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          connectWallet()
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [])

  return (
    <div className="App">
      <Toaster position="top-right" />
      
      <div className="container">
        <header>
          <h1>🚀 DeFi Staking Platform</h1>
          <p>Stake your tokens and earn rewards!</p>
        </header>

        {!account ? (
          <WalletConnect 
            onConnect={connectWallet}
            loading={loading}
          />
        ) : (
          <>
            <div className="wallet-info">
              <div>
                <strong>Connected Wallet:</strong>
                <div className="address">{account}</div>
              </div>
              <div>
                <strong>Network:</strong> {chainId === 1337 ? 'Localhost' : `Chain ID: ${chainId}`}
              </div>
              <button 
                onClick={disconnectWallet}
                className="secondary"
                style={{ marginTop: '1rem' }}
              >
                Disconnect
              </button>
            </div>

            {contracts && (
              <>
                <StatsDisplay 
                  contracts={contracts}
                  account={account}
                />
                <StakingInterface 
                  contracts={contracts}
                  account={account}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App