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
    <>
    <div className="wallet-connector-container">
      <div className="section-header mb-8">
        <h2 className="section-title mobile-section-title">Connect Your Wallet</h2>
        <p className="section-subtitle mobile-section-subtitle">
          Choose from our supported wallets to connect to the DeFi platform
        </p>
      </div>

      {/* Popular Wallets */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gradient-primary text-center mobile-wallet-title">🔥 Popular Wallets</h3>
        <div className="mobile-wallet-grid">
          {popularWallets.map(wallet => {
            const isInstalled = installedWallets[wallet.id]
            const isConnecting = connecting === wallet.id

            return (
              <div 
                key={wallet.id} 
                className="feature-card hover:scale-[1.02] transition-all duration-200 border-2 hover:border-opacity-50"
                style={{ 
                  borderColor: isInstalled ? wallet.color + '40' : 'transparent',
                  boxShadow: isInstalled ? `0 4px 20px ${wallet.color}15` : 'var(--shadow-xl)'
                }}
              >
                {/* Header with Icon and Wallet Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ 
                      backgroundColor: wallet.color + '15', 
                      color: wallet.color,
                      border: `2px solid ${wallet.color}25`
                    }}
                  >
                    <span className="text-3xl">{wallet.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1 text-primary truncate">{wallet.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      {isInstalled ? (
                        <span 
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ 
                            backgroundColor: '#10b98115', 
                            color: '#10b981',
                            border: '1px solid #10b98130'
                          }}
                        >
                          <span className="text-xs">✅</span> Ready
                        </span>
                      ) : (
                        <span 
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ 
                            backgroundColor: '#f59e0b15', 
                            color: '#f59e0b',
                            border: '1px solid #f59e0b30'
                          }}
                        >
                          <span className="text-xs">📥</span> Install Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary opacity-75">
                      {isInstalled ? 'Click connect to proceed' : 'Install wallet to continue'}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  {isInstalled ? (
                    <button
                      onClick={() => {
                        console.log(`🔗 Connecting to ${wallet.name}...`)
                        connectWallet(wallet.id)
                      }}
                      disabled={isConnecting}
                      className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
                      style={{
                        backgroundColor: isConnecting ? '#6b7280' : wallet.color,
                        color: 'white',
                        boxShadow: isConnecting ? 'none' : `0 2px 10px ${wallet.color}30`
                      }}
                    >
                      {isConnecting ? (
                        <>
                          <div className="loading-enhanced w-4 h-4"></div>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Connect {wallet.name}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        console.log(`📥 Installing ${wallet.name}...`)
                        openWalletDownload(wallet)
                      }}
                      className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
                      style={{
                        backgroundColor: 'var(--color-secondary)',
                        color: 'var(--text-primary)',
                        border: `2px solid ${wallet.color}30`
                      }}
                    >
                      <span>📥</span>
                      <span>Install {wallet.name}</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Other Wallets */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-6 text-gradient-secondary text-center">✨ Additional Wallets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {otherWallets.map(wallet => {
            const isInstalled = installedWallets[wallet.id]
            const isConnecting = connecting === wallet.id

            return (
              <div 
                key={wallet.id} 
                className="feature-card text-center hover:scale-[1.03] transition-all duration-200 min-h-[160px] flex flex-col"
                style={{
                  borderColor: isInstalled ? wallet.color + '30' : 'transparent',
                  background: isInstalled 
                    ? `linear-gradient(135deg, ${wallet.color}05 0%, transparent 50%)` 
                    : 'var(--glass-bg)'
                }}
              >
                {/* Wallet Icon */}
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-all duration-200 hover:scale-110"
                    style={{ 
                      backgroundColor: wallet.color + '15', 
                      color: wallet.color,
                      border: `1px solid ${wallet.color}25`
                    }}
                  >
                    <span className="text-xl">{wallet.icon}</span>
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-1 text-primary">{wallet.name}</h4>
                  
                  <div className="mb-3">
                    {isInstalled ? (
                      <span 
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: '#10b98110', 
                          color: '#10b981'
                        }}
                      >
                        <span className="text-xs">✅</span> Ready
                      </span>
                    ) : (
                      <span 
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: '#f59e0b10', 
                          color: '#f59e0b'
                        }}
                      >
                        <span className="text-xs">📥</span> Install
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="p-2 pt-0">
                  {isInstalled ? (
                    <button
                      onClick={() => {
                        console.log(`🔗 Connecting to ${wallet.name}...`)
                        connectWallet(wallet.id)
                      }}
                      disabled={isConnecting}
                      className="w-full py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor: isConnecting ? '#6b7280' : wallet.color,
                        color: 'white',
                        boxShadow: isConnecting ? 'none' : `0 2px 8px ${wallet.color}25`
                      }}
                    >
                      {isConnecting ? (
                        <>
                          <div className="loading-enhanced w-3 h-3"></div>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Connect</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        console.log(`📥 Installing ${wallet.name}...`)
                        openWalletDownload(wallet)
                      }}
                      className="w-full py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                      style={{
                        backgroundColor: 'var(--color-secondary)',
                        color: 'var(--text-secondary)',
                        border: `1px solid ${wallet.color}20`
                      }}
                    >
                      <span>📥</span>
                      <span>Install</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Security Features */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-6 text-center text-primary">🛡️ Why Choose Our Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="feature-card text-center hover:scale-[1.02] transition-all duration-200">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-200"
              style={{ 
                backgroundColor: '#10b98115', 
                color: '#10b981',
                border: '2px solid #10b98125'
              }}
            >
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="font-bold mb-2 text-primary">Bank-Level Security</h4>
            <p className="text-sm text-secondary leading-relaxed">
              Your wallet data is encrypted with military-grade security and never stored on our servers
            </p>
          </div>
          
          <div className="feature-card text-center hover:scale-[1.02] transition-all duration-200">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-200"
              style={{ 
                backgroundColor: '#3b82f615', 
                color: '#3b82f6',
                border: '2px solid #3b82f625'
              }}
            >
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-bold mb-2 text-primary">Lightning Fast</h4>
            <p className="text-sm text-secondary leading-relaxed">
              Connect instantly with optimized protocols and start accessing features in seconds
            </p>
          </div>
          
          <div className="feature-card text-center hover:scale-[1.02] transition-all duration-200">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-200"
              style={{ 
                backgroundColor: '#f59e0b15', 
                color: '#f59e0b',
                border: '2px solid #f59e0b25'
              }}
            >
              <span className="text-2xl">🌐</span>
            </div>
            <h4 className="font-bold mb-2 text-primary">Multi-Chain Support</h4>
            <p className="text-sm text-secondary leading-relaxed">
              Compatible with Ethereum, BSC, Polygon, and 20+ other popular blockchain networks
            </p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div 
        className="feature-card text-center max-w-2xl mx-auto"
        style={{
          background: 'linear-gradient(135deg, #3b82f608 0%, #10b98108 100%)',
          border: '2px solid #3b82f615'
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: '#3b82f615', 
              color: '#3b82f6'
            }}
          >
            <span className="text-xl">🎓</span>
          </div>
          <h4 className="text-lg font-bold text-primary">New to Web3?</h4>
        </div>
        
        <p className="text-sm text-secondary mb-6 leading-relaxed">
          New to crypto wallets? Don’t worry! Check out our comprehensive beginner’s guide 
          to learn how to set up and use your first wallet safely and securely.
        </p>
        
        <div className="flex gap-3 justify-center">
          <button 
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              boxShadow: '0 2px 10px #3b82f630'
            }}
          >
            <span>📚</span>
            <span>Learn More</span>
          </button>
          
          <button 
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--text-primary)',
              border: '2px solid #3b82f620'
            }}
          >
            <span>📹</span>
            <span>Watch Tutorial</span>
          </button>
        </div>
      </div>
    </div>
    
    <style jsx>{`
      /* Mobile-specific styles */
      .wallet-connector-container {
        max-width: 1024px;
        margin: 0 auto;
        padding: 0 var(--space-4);
      }
      
      .mobile-wallet-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-4);
        max-width: 600px;
        margin: 0 auto;
      }
      
      @media (min-width: 640px) {
        .mobile-wallet-grid {
          grid-template-columns: 1fr;
          max-width: 500px;
        }
      }
      
      @media (min-width: 768px) {
        .mobile-wallet-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
          max-width: 800px;
        }
      }
      
      @media (max-width: 768px) {
        .wallet-connector-container {
          padding: 0 var(--space-3);
        }
        
        .mobile-section-title {
          font-size: 1.75rem !important;
          margin-bottom: var(--space-3);
        }
        
        .mobile-section-subtitle {
          font-size: 0.875rem !important;
          line-height: 1.6;
          margin-bottom: var(--space-6);
        }
        
        .mobile-wallet-title {
          font-size: 1.125rem !important;
          margin-bottom: var(--space-4) !important;
        }
        
        .feature-card {
          padding: var(--space-4) !important;
          margin-bottom: var(--space-4);
          border-radius: var(--radius-xl);
        }
        
        .feature-card button {
          min-height: 48px !important;
          padding: var(--space-3) var(--space-4) !important;
          font-size: 0.875rem !important;
          border-radius: var(--radius-lg);
          font-weight: 600;
        }
        
        .feature-card .w-16 {
          width: 56px !important;
          height: 56px !important;
        }
        
        .feature-card .text-3xl {
          font-size: 1.75rem !important;
        }
        
        .feature-card .text-lg {
          font-size: 1rem !important;
        }
        
        .feature-card .text-xs {
          font-size: 0.75rem !important;
        }
        
        .grid.grid-cols-2.md\\:grid-cols-4 {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: var(--space-3) !important;
        }
        
        .grid.grid-cols-1.md\\:grid-cols-3 {
          grid-template-columns: 1fr !important;
          gap: var(--space-4) !important;
        }
        
        .feature-card.max-w-2xl {
          max-width: none !important;
        }
        
        .feature-card .flex.gap-3 {
          flex-direction: column !important;
          gap: var(--space-3) !important;
        }
        
        .feature-card .flex.gap-3 button {
          width: 100% !important;
        }
        
        .inline-flex.items-center.gap-1 {
          padding: var(--space-1) var(--space-2) !important;
          font-size: 0.6875rem !important;
        }
      }
      
      @media (max-width: 480px) {
        .wallet-connector-container {
          padding: 0 var(--space-2);
        }
        
        .mobile-section-title {
          font-size: 1.5rem !important;
        }
        
        .mobile-section-subtitle {
          font-size: 0.75rem !important;
        }
        
        .feature-card {
          padding: var(--space-3) !important;
        }
        
        .feature-card .flex.items-center.gap-4 {
          flex-direction: column !important;
          text-align: center !important;
          gap: var(--space-3) !important;
        }
        
        .feature-card .flex-1.min-w-0 {
          min-width: auto !important;
          width: 100% !important;
        }
        
        .grid.grid-cols-2.md\\:grid-cols-4 {
          grid-template-columns: 1fr !important;
        }
        
        .feature-card.min-h-\\[160px\\] {
          min-height: auto !important;
          padding: var(--space-3) !important;
        }
      }
      
      @media (hover: none) and (pointer: coarse) {
        .feature-card button {
          min-height: 48px !important;
          padding: var(--space-3) var(--space-4) !important;
        }
        
        .feature-card:hover {
          transform: none !important;
        }
        
        .feature-card .hover\\:scale-110:hover {
          transform: none !important;
        }
        
        .feature-card .hover\\:scale-\\[1\\.02\\]:hover {
          transform: none !important;
        }
        
        .feature-card button:active {
          transform: scale(0.98);
          transition: transform 0.1s ease;
        }
      }
    `}</style>
    </>
  )
}

export default WalletConnector
