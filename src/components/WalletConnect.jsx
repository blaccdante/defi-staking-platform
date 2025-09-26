import React, { useState } from 'react'

const WalletConnect = ({ onConnect, loading }) => {
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  // Wallet providers configuration
  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect with the most popular Ethereum wallet',
      icon: 'metamask',
      popular: true,
      installed: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase Wallet for easy access',
      icon: 'coinbase',
      popular: true,
      installed: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect with 300+ wallets via QR code',
      icon: 'walletconnect',
      popular: true,
      installed: true // Always available
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      description: 'Mobile-first DeFi wallet',
      icon: 'trust',
      popular: false,
      installed: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isTrust
    }
  ]

  // Wallet Icons
  const MetaMaskIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M19.3 3.1L12 8.3 13.6 4.8L19.3 3.1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.1"/>
      <path d="M4.7 3.1L12 8.3 10.4 4.8L4.7 3.1Z" fill="#E27D60" stroke="#E27D60" strokeWidth="0.1"/>
      <path d="M16.7 17.4L15.1 19.7L19 20.6L20 17.5L16.7 17.4Z" fill="#E27D60" stroke="#E27D60" strokeWidth="0.1"/>
      <path d="M4 17.5L5 20.6L8.9 19.7L7.3 17.4L4 17.5Z" fill="#E27D60" stroke="#E27D60" strokeWidth="0.1"/>
    </svg>
  )

  const CoinbaseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="10" fill="#0052FF"/>
      <rect x="7" y="10" width="10" height="4" rx="2" fill="white"/>
      <rect x="10" y="7" width="4" height="10" rx="2" fill="white"/>
    </svg>
  )

  const WalletConnectIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M7 10.5C9.5 7.5 14.5 7.5 17 10.5L17.5 11L19 9.5L18.5 9C15 5 9 5 5.5 9L5 9.5L6.5 11L7 10.5Z" fill="#3B99FC"/>
      <path d="M6 14.5L9.5 18L10 17.5L13.5 14L14 13.5L12.5 12L12 12.5L8.5 16L8 16.5L4.5 13L6 14.5Z" fill="#3B99FC"/>
    </svg>
  )

  const TrustIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6V11C4 16.5 7.5 21.5 12 22C16.5 21.5 20 16.5 20 11V6L12 2Z" fill="#3375BB"/>
      <path d="M8 11L10.5 13.5L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const getWalletIcon = (iconType) => {
    switch (iconType) {
      case 'metamask': return <MetaMaskIcon />
      case 'coinbase': return <CoinbaseIcon />
      case 'walletconnect': return <WalletConnectIcon />
      case 'trust': return <TrustIcon />
      default: return <MetaMaskIcon />
    }
  }

  // Additional Icons
  const SecurityIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  )

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <circle cx="12" cy="16" r="1"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )

  const GlobeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )

  const SpeedIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  )

  const handleWalletConnect = (walletId) => {
    setSelectedWallet(walletId)
    // For now, all wallets use the same connection method
    onConnect()
  }

  return (
    <div className="wallet-connect-container" style={{ 
      maxWidth: '900px', 
      margin: '0 auto',
      padding: 'var(--space-6)',
      display: 'grid',
      gap: 'var(--space-8)',
      gridTemplateColumns: 'minmax(0, 1fr)'
    }}>
      {/* Header Section */}
      <div className="text-center">
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'var(--gradient-primary)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto var(--space-6) auto',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <SecurityIcon />
        </div>
        <h1 style={{ 
          fontSize: 'var(--text-4xl)', 
          fontWeight: '800', 
          marginBottom: 'var(--space-4)',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Connect Your Wallet
        </h1>
        <p style={{ 
          fontSize: 'var(--text-lg)', 
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          margin: '0 auto var(--space-8) auto',
          lineHeight: '1.7'
        }}>
          Choose your preferred wallet to access professional DeFi staking services, 
          multiple pools, and advanced analytics.
        </p>
      </div>

      {/* Popular Wallets Section */}
      <div>
        <h3 style={{ 
          fontSize: 'var(--text-xl)', 
          fontWeight: '600', 
          marginBottom: 'var(--space-6)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          🔥 Popular Wallets
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-4)'
        }}>
          {walletProviders.filter(wallet => wallet.popular).map((wallet) => (
            <div
              key={wallet.id}
              className="card"
              style={{
                margin: '0',
                padding: 'var(--space-6)',
                cursor: wallet.installed ? 'pointer' : 'default',
                opacity: wallet.installed ? 1 : 0.6,
                transition: 'all var(--transition-fast)',
                border: selectedWallet === wallet.id ? '2px solid var(--color-primary)' : '1px solid var(--border-primary)'
              }}
              onClick={() => wallet.installed && handleWalletConnect(wallet.id)}
              onMouseEnter={(e) => {
                if (wallet.installed) {
                  e.target.style.transform = 'translateY(-4px)'
                  e.target.style.boxShadow = 'var(--shadow-2xl)'
                }
              }}
              onMouseLeave={(e) => {
                if (wallet.installed) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'var(--shadow-xl)'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                {getWalletIcon(wallet.icon)}
                <div>
                  <h4 style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: '600', 
                    margin: '0 0 var(--space-1) 0',
                    color: 'var(--text-primary)'
                  }}>
                    {wallet.name}
                  </h4>
                  <p style={{ 
                    fontSize: 'var(--text-sm)', 
                    color: 'var(--text-secondary)', 
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {wallet.description}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 'var(--space-4)'
              }}>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600',
                  color: wallet.installed ? 'var(--color-success)' : 'var(--color-warning)',
                  background: wallet.installed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {wallet.installed ? 'Installed' : 'Not Installed'}
                </span>
                
                {loading && selectedWallet === wallet.id ? (
                  <div className="loading" style={{ marginLeft: 'auto' }} />
                ) : (
                  <button
                    className={wallet.installed ? 'primary' : 'secondary'}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      fontSize: 'var(--text-sm)',
                      borderRadius: 'var(--radius-md)'
                    }}
                    disabled={!wallet.installed}
                  >
                    {wallet.installed ? 'Connect' : 'Install'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Wallets Section */}
      <div>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: '600', 
          marginBottom: 'var(--space-4)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          Other Wallets
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-4)'
        }}>
          {walletProviders.filter(wallet => !wallet.popular).map((wallet) => (
            <div
              key={wallet.id}
              className="card"
              style={{
                margin: '0',
                padding: 'var(--space-4)',
                cursor: wallet.installed ? 'pointer' : 'default',
                opacity: wallet.installed ? 1 : 0.6,
                transition: 'all var(--transition-fast)'
              }}
              onClick={() => wallet.installed && handleWalletConnect(wallet.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {getWalletIcon(wallet.icon)}
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: 'var(--text-base)', 
                    fontWeight: '600', 
                    margin: '0',
                    color: 'var(--text-primary)'
                  }}>
                    {wallet.name}
                  </h4>
                  <p style={{ 
                    fontSize: 'var(--text-xs)', 
                    color: 'var(--text-tertiary)', 
                    margin: 0
                  }}>
                    {wallet.description}
                  </p>
                </div>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  color: wallet.installed ? 'var(--color-success)' : 'var(--color-warning)'
                }}>
                  {wallet.installed ? '✓' : '○'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <div className="card" style={{ margin: 0, padding: 'var(--space-6)' }}>
        <h3 style={{ 
          fontSize: 'var(--text-xl)', 
          fontWeight: '600', 
          marginBottom: 'var(--space-6)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          🛡️ Why BlaccManny is Secure
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 'var(--space-6)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3) auto',
              color: 'var(--color-success)'
            }}>
              <LockIcon />
            </div>
            <h4 style={{ 
              fontSize: 'var(--text-base)', 
              fontWeight: '600', 
              marginBottom: 'var(--space-2)',
              color: 'var(--text-primary)'
            }}>Non-Custodial</h4>
            <p style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-secondary)', 
              margin: 0,
              lineHeight: '1.5'
            }}>
              Your keys, your crypto. We never have access to your funds.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(6, 182, 212, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3) auto',
              color: 'var(--color-info)'
            }}>
              <GlobeIcon />
            </div>
            <h4 style={{ 
              fontSize: 'var(--text-base)', 
              fontWeight: '600', 
              marginBottom: 'var(--space-2)',
              color: 'var(--text-primary)'
            }}>Decentralized</h4>
            <p style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-secondary)', 
              margin: 0,
              lineHeight: '1.5'
            }}>
              Built on Ethereum with transparent smart contracts.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3) auto',
              color: 'var(--color-warning)'
            }}>
              <SpeedIcon />
            </div>
            <h4 style={{ 
              fontSize: 'var(--text-base)', 
              fontWeight: '600', 
              marginBottom: 'var(--space-2)',
              color: 'var(--text-primary)'
            }}>Fast & Efficient</h4>
            <p style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-secondary)', 
              margin: 0,
              lineHeight: '1.5'
            }}>
              Optimized gas usage and instant reward calculations.
            </p>
          </div>
        </div>
      </div>

      {/* Help & Links */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 'var(--space-4)',
        marginTop: 'var(--space-4)'
      }}>
        <div className="card" style={{ 
          margin: 0, 
          padding: 'var(--space-4)',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: 'var(--text-base)', 
            fontWeight: '600', 
            marginBottom: 'var(--space-2)',
            color: 'var(--text-primary)'
          }}>New to Web3?</h4>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginBottom: 'var(--space-3)'
          }}>
            Learn how to set up your first wallet
          </p>
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="secondary"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            Get Started Guide
          </button>
        </div>
        
        <div className="card" style={{ 
          margin: 0, 
          padding: 'var(--space-4)',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: 'var(--text-base)', 
            fontWeight: '600', 
            marginBottom: 'var(--space-2)',
            color: 'var(--text-primary)'
          }}>Need Help?</h4>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginBottom: 'var(--space-3)'
          }}>
            Check our documentation and FAQ
          </p>
          <a 
            href="#" 
            style={{ 
              color: 'var(--color-primary)', 
              fontSize: 'var(--text-sm)', 
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Support Center →
          </a>
        </div>
      </div>

      {/* Terms */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
        <p style={{ 
          fontSize: 'var(--text-xs)', 
          color: 'var(--text-tertiary)',
          margin: 0
        }}>
          By connecting a wallet, you agree to BlaccManny's{' '}
          <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default WalletConnect