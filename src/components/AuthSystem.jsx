import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'

const AuthSystem = ({ onAuth, onLogout, user }) => {
  const [authMode, setAuthMode] = useState('login') // 'login', 'signup', 'profile'
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    notifications: {
      trades: true,
      priceAlerts: true,
      news: false
    }
  })

  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        ...user
      }))
    }
  }, [user])

  const signMessage = async (message, signer) => {
    try {
      const signature = await signer.signMessage(message)
      return signature
    } catch (error) {
      throw new Error('Failed to sign message: ' + error.message)
    }
  }

  const handleWalletLogin = async (walletData) => {
    setLoading(true)
    
    try {
      const message = `Welcome to DeFi Staking Platform!\n\nSign this message to authenticate your wallet.\n\nTimestamp: ${Date.now()}`
      const signature = await signMessage(message, walletData.signer)
      
      // In a real app, you'd send this to your backend for verification
      const authData = {
        address: walletData.address,
        walletType: walletData.walletType,
        chainId: walletData.chainId,
        signature,
        message,
        timestamp: Date.now()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onAuth({
        ...authData,
        ...userData,
        isAuthenticated: true
      })

      toast.success('Successfully authenticated!')
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleWalletSignup = async (walletData) => {
    if (!userData.username.trim()) {
      toast.error('Please enter a username')
      return
    }

    setLoading(true)
    
    try {
      const message = `Create account on DeFi Staking Platform\n\nUsername: ${userData.username}\nEmail: ${userData.email}\nTimestamp: ${Date.now()}`
      const signature = await signMessage(message, walletData.signer)
      
      // In a real app, you'd send this to your backend
      const authData = {
        address: walletData.address,
        walletType: walletData.walletType,
        chainId: walletData.chainId,
        signature,
        message,
        timestamp: Date.now(),
        ...userData,
        isAuthenticated: true,
        isNewUser: true
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onAuth(authData)

      toast.success(`Welcome ${userData.username}! Account created successfully!`)
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onAuth({
        ...user,
        ...userData
      })

      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout()
    setUserData({
      username: '',
      email: '',
      bio: '',
      avatar: '',
      notifications: {
        trades: true,
        priceAlerts: true,
        news: false
      }
    })
    toast.success('Logged out successfully')
  }

  if (user && user.isAuthenticated && authMode !== 'profile') {
    return (
      <div className="feature-card">
        <div className="text-center mb-6">
          <div className="feature-icon mx-auto mb-3" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
            👤
          </div>
          <h3 className="form-title">Welcome Back!</h3>
          <p className="text-secondary">{user.username || 'Anonymous User'}</p>
        </div>

        <div className="responsive-grid-2 gap-4 mb-6">
          <div className="stat-card-enhanced">
            <div className="stat-label-enhanced">Wallet</div>
            <div className="font-mono text-sm">
              {user.address?.slice(0, 6)}...{user.address?.slice(-4)}
            </div>
          </div>
          
          <div className="stat-card-enhanced">
            <div className="stat-label-enhanced">Network</div>
            <div className="text-sm">
              Chain ID: {user.chainId}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setAuthMode('profile')}
            className="btn-enhanced btn-secondary-enhanced btn-medium flex-1"
          >
            ⚙️ Profile
          </button>
          <button 
            onClick={handleLogout}
            className="btn-enhanced btn-secondary-enhanced btn-medium flex-1"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    )
  }

  if (authMode === 'profile') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="section-header mb-8">
          <h2 className="section-title">User Profile</h2>
          <p className="section-subtitle">Manage your account settings and preferences</p>
        </div>

        <div className="form-section">
          <div className="text-center mb-6">
            <div className="feature-icon mx-auto mb-3" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
              👤
            </div>
            <div className="text-lg font-semibold">{userData.username || 'Anonymous'}</div>
            <div className="text-sm text-secondary font-mono">
              {user?.address?.slice(0, 6)}...{user?.address?.slice(-4)}
            </div>
          </div>

          <div className="space-y-6">
            <div className="form-group-enhanced">
              <label className="form-label-enhanced">Username</label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
                className="form-input-enhanced"
                placeholder="Your username"
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label-enhanced">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input-enhanced"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label-enhanced">Bio</label>
              <textarea
                value={userData.bio}
                onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                className="form-input-enhanced"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label-enhanced">Notification Preferences</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={userData.notifications.trades}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, trades: e.target.checked }
                    }))}
                    className="w-4 h-4"
                  />
                  <span>Trade notifications</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={userData.notifications.priceAlerts}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, priceAlerts: e.target.checked }
                    }))}
                    className="w-4 h-4"
                  />
                  <span>Price alerts</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={userData.notifications.news}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, news: e.target.checked }
                    }))}
                    className="w-4 h-4"
                  />
                  <span>News updates</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setAuthMode('login')}
              className="btn-enhanced btn-secondary-enhanced btn-medium"
            >
              ← Back
            </button>
            <button
              onClick={updateProfile}
              disabled={loading}
              className="btn-enhanced btn-primary-enhanced btn-medium flex-1"
            >
              {loading ? (
                <>
                  <div className="loading-enhanced"></div>
                  Updating...
                </>
              ) : (
                <>
                  💾 Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="section-header mb-8">
        <h2 className="section-title">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="section-subtitle">
          {authMode === 'login' 
            ? 'Sign in with your wallet to access your DeFi dashboard'
            : 'Set up your new account to start using our platform'
          }
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="nav-tabs-enhanced mb-8">
        <button
          onClick={() => setAuthMode('login')}
          className={`nav-tab-enhanced ${authMode === 'login' ? 'active' : ''}`}
        >
          🔑 Login
        </button>
        <button
          onClick={() => setAuthMode('signup')}
          className={`nav-tab-enhanced ${authMode === 'signup' ? 'active' : ''}`}
        >
          ✨ Sign Up
        </button>
      </div>

      <div className="form-section">
        {authMode === 'signup' && (
          <div className="space-y-6 mb-8">
            <div className="form-group-enhanced">
              <label className="form-label-enhanced">Username *</label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
                className="form-input-enhanced"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label-enhanced">Email (Optional)</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input-enhanced"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label-enhanced">Bio (Optional)</label>
              <textarea
                value={userData.bio}
                onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                className="form-input-enhanced"
                rows="2"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        )}

        {/* Wallet Connection Step */}
        <div className="text-center">
          <div className="feature-icon mx-auto mb-4" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
            🌟
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-secondary mb-6">
            {authMode === 'login' 
              ? 'Connect your wallet and sign a message to authenticate'
              : 'Connect your wallet to create your account'
            }
          </p>

          <WalletConnectorAuth 
            onConnect={authMode === 'login' ? handleWalletLogin : handleWalletSignup}
            loading={loading}
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="alert alert-info mt-6">
        <div>
          <h4 className="font-semibold mb-2">🔒 Security Notice</h4>
          <p className="text-sm">
            We use wallet signatures for authentication. Your private keys never leave your wallet, 
            and we don't store any sensitive information on our servers.
          </p>
        </div>
      </div>
    </div>
  )
}

// Simplified wallet connector for auth
const WalletConnectorAuth = ({ onConnect, loading }) => {
  const [connecting, setConnecting] = useState(null)

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', color: '#f6851b' },
    { id: 'binance', name: 'Binance Wallet', icon: '🟡', color: '#f3ba2f' },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️', color: '#3375bb' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', color: '#0052ff' }
  ]

  const handleConnect = async (walletId) => {
    setConnecting(walletId)
    
    try {
      let provider = null

      switch (walletId) {
        case 'metamask':
          if (!window.ethereum?.isMetaMask) throw new Error('MetaMask not installed')
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.ethereum)
          break

        case 'binance':
          if (!window.BinanceChain) throw new Error('Binance Wallet not installed')
          await window.BinanceChain.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.BinanceChain)
          break

        case 'trust':
          if (!window.ethereum?.isTrust) throw new Error('Trust Wallet not installed')
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.ethereum)
          break

        case 'coinbase':
          if (!window.ethereum?.isCoinbaseWallet) throw new Error('Coinbase Wallet not installed')
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          provider = new ethers.BrowserProvider(window.ethereum)
          break

        default:
          throw new Error('Wallet not supported')
      }

      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      await onConnect({
        provider,
        signer,
        address,
        chainId: Number(network.chainId),
        walletType: walletId
      })

    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error(error.message || 'Failed to connect wallet')
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className="responsive-grid-2 gap-4">
      {wallets.map(wallet => {
        const isConnecting = connecting === wallet.id

        return (
          <button
            key={wallet.id}
            onClick={() => handleConnect(wallet.id)}
            disabled={loading || isConnecting}
            className="feature-card text-center hover:scale-105 transition-transform cursor-pointer border-0"
          >
            <div 
              className="feature-icon mx-auto mb-3"
              style={{ backgroundColor: wallet.color + '20', color: wallet.color }}
            >
              <span className="text-2xl">{wallet.icon}</span>
            </div>
            <h4 className="font-semibold mb-2">{wallet.name}</h4>
            {(loading || isConnecting) ? (
              <div className="loading-enhanced mx-auto"></div>
            ) : (
              <span className="text-sm text-gradient-primary">Click to connect</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default AuthSystem