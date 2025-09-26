import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'

const WalletConnector = ({ onConnect, onDisconnect, currentWallet, account }) => {
  const [connecting, setConnecting] = useState(null)
  const [installedWallets, setInstalledWallets] = useState({})

  // Wallet configurations
  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      color: '#f6851b',
      popular: true,
      downloadUrl: 'https://metamask.io/',
      detect: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
    },
    {
      id: 'binance',
      name: 'Binance Wallet',
      icon: '🟡',
      color: '#f3ba2f',
      popular: true,
      downloadUrl: 'https://www.binance.org/en/binance-wallet',
      detect: () => typeof window.BinanceChain !== 'undefined'
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      color: '#3375bb',
      popular: true,
      downloadUrl: 'https://trustwallet.com/',
      detect: () => typeof window.ethereum !== 'undefined' && window.ethereum.isTrust
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      color: '#0052ff',
      popular: true,
      downloadUrl: 'https://wallet.coinbase.com/',
      detect: () => typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      color: '#3b99fc',
      popular: false,
      downloadUrl: 'https://walletconnect.com/',
      detect: () => true // Always available as it's a protocol
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      color: '#ab9ff2',
      popular: false,
      downloadUrl: 'https://phantom.app/',
      detect: () => typeof window.solana !== 'undefined' && window.solana.isPhantom
    },
    {
      id: 'brave',
      name: 'Brave Wallet',
      icon: '🦁',
      color: '#fb542b',
      popular: false,
      downloadUrl: 'https://brave.com/wallet/',
      detect: () => typeof window.ethereum !== 'undefined' && window.ethereum.isBraveWallet
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      icon: '🌈',
      color: '#ff6b4a',
      popular: false,
      downloadUrl: 'https://rainbow.me/',
      detect: () => typeof window.ethereum !== 'undefined' && window.ethereum.isRainbow
    }
  ]

  useEffect(() => {
    checkInstalledWallets()
  }, [])

  const checkInstalledWallets = () => {
    const installed = {}
    wallets.forEach(wallet => {
      installed[wallet.id] = wallet.detect()
    })
    setInstalledWallets(installed)
  }

  const connectWallet = async (walletId) => {
    setConnecting(walletId)
    
    try {
      let provider = null
      let accounts = []

      switch (walletId) {
        case 'metamask':
          if (!window.ethereum?.isMetaMask) {
            throw new Error('MetaMask not installed')
          }
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.ethereum)
          accounts = await provider.listAccounts()
          break

        case 'binance':
          if (!window.BinanceChain) {
            throw new Error('Binance Wallet not installed')
          }
          await window.BinanceChain.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.BinanceChain)
          accounts = await provider.listAccounts()
          break

        case 'trust':
          if (!window.ethereum?.isTrust) {
            throw new Error('Trust Wallet not installed')
          }
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.ethereum)
          accounts = await provider.listAccounts()
          break

        case 'coinbase':
          if (!window.ethereum?.isCoinbaseWallet) {
            throw new Error('Coinbase Wallet not installed')
          }
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.ethereum)
          accounts = await provider.listAccounts()
          break

        case 'walletconnect':
          // WalletConnect integration would require additional setup
          toast.error('WalletConnect integration coming soon!')
          return

        case 'phantom':
          if (!window.solana?.isPhantom) {
            throw new Error('Phantom Wallet not installed')
          }
          const resp = await window.solana.connect()
          toast.success(`Connected to Phantom: ${resp.publicKey.toString()}`)
          return

        default:
          throw new Error('Wallet not supported')
      }

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      onConnect({
        provider,
        signer,
        address,
        chainId: Number(network.chainId),
        walletType: walletId
      })

      toast.success(`Connected to ${wallets.find(w => w.id === walletId)?.name}!`)
      
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error(error.message || 'Failed to connect wallet')
    } finally {
      setConnecting(null)
    }
  }

  const disconnectWallet = () => {
    onDisconnect()
    toast.success('Wallet disconnected')
  }

  const openWalletDownload = (wallet) => {
    window.open(wallet.downloadUrl, '_blank', 'noopener,noreferrer')
  }

  if (currentWallet && account) {
    return (
      <div className="feature-card">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="form-title">Wallet Connected</h3>
        </div>
        
        <div className="stat-card-enhanced mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">Wallet Type</span>
            <span className="text-gradient-primary font-semibold">
              {wallets.find(w => w.id === currentWallet)?.name || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">Address</span>
            <span className="font-mono text-sm">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        </div>

        <button 
          onClick={disconnectWallet}
          className="btn-enhanced btn-secondary-enhanced btn-large w-full"
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  const popularWallets = wallets.filter(w => w.popular)
  const otherWallets = wallets.filter(w => !w.popular)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="section-header mb-8">
        <h2 className="section-title">Connect Your Wallet</h2>
        <p className="section-subtitle">
          Choose from our supported wallets to connect to the DeFi platform
        </p>
      </div>

      {/* Popular Wallets */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gradient-primary">Popular Wallets</h3>
        <div className="responsive-grid-2 gap-4">
          {popularWallets.map(wallet => {
            const isInstalled = installedWallets[wallet.id]
            const isConnecting = connecting === wallet.id

            return (
              <div key={wallet.id} className="feature-card hover:scale-105 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="feature-icon"
                    style={{ backgroundColor: wallet.color + '20', color: wallet.color }}
                  >
                    <span className="text-2xl">{wallet.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{wallet.name}</h3>
                    <div className="flex items-center gap-2">
                      {isInstalled ? (
                        <span className="alert-success text-xs px-2 py-1 rounded-full">
                          ✅ Installed
                        </span>
                      ) : (
                        <span className="alert-warning text-xs px-2 py-1 rounded-full">
                          ⚠️ Not Installed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isInstalled ? (
                    <button
                      onClick={() => connectWallet(wallet.id)}
                      disabled={isConnecting}
                      className="btn-enhanced btn-primary-enhanced btn-medium flex-1"
                    >
                      {isConnecting ? (
                        <>
                          <div className="loading-enhanced"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          🔗 Connect
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => openWalletDownload(wallet)}
                      className="btn-enhanced btn-secondary-enhanced btn-medium flex-1"
                    >
                      📥 Install
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Other Wallets */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gradient-secondary">Other Wallets</h3>
        <div className="responsive-grid-4 gap-3">
          {otherWallets.map(wallet => {
            const isInstalled = installedWallets[wallet.id]
            const isConnecting = connecting === wallet.id

            return (
              <div key={wallet.id} className="feature-card text-center">
                <div 
                  className="feature-icon mx-auto mb-3"
                  style={{ backgroundColor: wallet.color + '20', color: wallet.color }}
                >
                  <span className="text-xl">{wallet.icon}</span>
                </div>
                <h4 className="font-medium mb-2">{wallet.name}</h4>
                
                {isInstalled ? (
                  <button
                    onClick={() => connectWallet(wallet.id)}
                    disabled={isConnecting}
                    className="btn-enhanced btn-primary-enhanced btn-small w-full"
                  >
                    {isConnecting ? (
                      <div className="loading-enhanced"></div>
                    ) : (
                      'Connect'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => openWalletDownload(wallet)}
                    className="btn-enhanced btn-secondary-enhanced btn-small w-full"
                  >
                    Install
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Security Info */}
      <div className="responsive-grid-3 gap-4 mb-8">
        <div className="feature-card text-center">
          <div className="feature-icon mx-auto mb-3" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
            🔒
          </div>
          <h4 className="font-semibold mb-2">Secure Connection</h4>
          <p className="text-sm text-secondary">
            Your wallet data is encrypted and never stored on our servers
          </p>
        </div>
        
        <div className="feature-card text-center">
          <div className="feature-icon mx-auto mb-3" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
            ⚡
          </div>
          <h4 className="font-semibold mb-2">Lightning Fast</h4>
          <p className="text-sm text-secondary">
            Connect instantly and start trading with minimal latency
          </p>
        </div>
        
        <div className="feature-card text-center">
          <div className="feature-icon mx-auto mb-3" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
            🌐
          </div>
          <h4 className="font-semibold mb-2">Multi-Chain</h4>
          <p className="text-sm text-secondary">
            Support for Ethereum, BSC, Polygon, and other popular networks
          </p>
        </div>
      </div>

      {/* Help Section */}
      <div className="alert alert-info">
        <div>
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-sm mb-3">
            New to crypto wallets? Check out our beginner's guide to get started safely.
          </p>
          <button className="btn-enhanced btn-secondary-enhanced btn-small">
            📚 Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default WalletConnector