import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useFirebase } from '../contexts/FirebaseContext'

const AccountManager = ({ user, onAccountCreated, onClose }) => {
  console.log('🎯 AccountManager component loaded', { user, onAccountCreated, onClose })
  console.log('AccountManager received user:', user)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    bio: ''
  })

  const { 
    signup: firebaseSignup, 
    checkUsernameAvailable,
    linkWalletAddress,
    loading: firebaseLoading
  } = useFirebase()

  const signMessage = async (message, signer) => {
    try {
      const signature = await signer.signMessage(message)
      return signature
    } catch (error) {
      throw new Error('Failed to sign message: ' + error.message)
    }
  }

  const handleCreateAccount = async () => {
    if (!userData.username.trim()) {
      toast.error('Please enter a username')
      return
    }
    if (!userData.email || !userData.password) {
      toast.error('Please enter both email and password')
      return
    }
    if (userData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsCreatingAccount(true)
    try {
      // Check username availability
      const isUsernameAvailable = await checkUsernameAvailable(userData.username)
      if (!isUsernameAvailable) {
        toast.error('Username is already taken')
        return
      }

      // Create Firebase account
      const result = await firebaseSignup(userData.email, userData.password, {
        username: userData.username,
        bio: userData.bio
      })
      
      if (result.success) {
        // Link the existing wallet to the new account
        try {
          const message = `Link wallet to DeFi Staking Platform\n\nUser: ${userData.username}\nWallet: ${user.address}\nTimestamp: ${Date.now()}`
          const signature = await signMessage(message, user.signer)
          
          const linkResult = await linkWalletAddress(user.address)
          
          if (linkResult.success) {
            const enhancedUserData = {
              ...user,
              firebaseUser: result.user,
              username: userData.username,
              email: userData.email,
              bio: userData.bio,
              walletOnly: false, // Now has full account
              signature,
              message
            }
            
            onAccountCreated(enhancedUserData)
            toast.success('Account created and wallet linked successfully!')
            onClose()
          } else {
            throw new Error(linkResult.error || 'Failed to link wallet')
          }
        } catch (walletError) {
          console.error('Wallet linking failed:', walletError)
          toast.error('Account created but wallet linking failed. You can try again later.')
          onClose()
        }
      } else {
        toast.error(result.error || 'Failed to create account')
      }
    } catch (error) {
      console.error('Account creation error:', error)
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsCreatingAccount(false)
    }
  }

  // Debug info
  console.log('User walletOnly status:', user?.walletOnly)
  console.log('User has email:', !!user?.email)
  
  // Add error boundary protection
  const renderWithErrorBoundary = (content) => {
    try {
      return content
    } catch (error) {
      console.error('AccountManager render error:', error)
      return (
        <div className="alert alert-error">
          <h3>⚠️ Account Manager Error</h3>
          <p>There was an issue loading the account manager.</p>
          <button onClick={onClose} className="btn-enhanced btn-secondary-enhanced btn-small mt-2">
            ← Back
          </button>
        </div>
      )
    }
  }

  if (!user) {
    return renderWithErrorBoundary(
      <div className="feature-card">
        <div className="text-center">
          <div className="feature-icon mx-auto mb-4" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
            ⚠️
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect Wallet First</h3>
          <p className="text-secondary mb-4">
            Please connect your wallet before creating an account.
          </p>
          <button 
            onClick={onClose}
            className="btn-enhanced btn-secondary-enhanced btn-small"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }
  
  if (user.email && !user.walletOnly) {
    return renderWithErrorBoundary(
      <div className="feature-card">
        <div className="text-center">
          <div className="feature-icon mx-auto mb-4" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
            ✅
          </div>
          <h3 className="text-xl font-semibold mb-2">Account Already Created</h3>
          <p className="text-secondary mb-4">
            You already have a full account with email authentication.
          </p>
          <div className="space-y-2 text-sm text-left">
            <div><strong>Username:</strong> {user.username}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Wallet:</strong> {user.address?.slice(0, 6)}...{user.address?.slice(-4)}</div>
          </div>
          <button 
            onClick={onClose}
            className="btn-enhanced btn-secondary-enhanced btn-small mt-4"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  return renderWithErrorBoundary(
    <div className="max-w-2xl mx-auto">
      <div className="section-header mb-8">
        <h2 className="section-title">🎯 Create Your Account</h2>
        <p className="section-subtitle">
          Optional: Create an email account to unlock additional features and save your preferences
        </p>
      </div>

      {/* Current Status */}
      <div className="alert alert-info mb-6">
        <div className="flex items-center gap-3">
          <div className="text-xl">👛</div>
          <div>
            <h4 className="font-semibold mb-1">Wallet Connected</h4>
            <p className="text-sm">
              {user?.walletType} • {user?.address?.slice(0, 6)}...{user?.address?.slice(-4)}
            </p>
            <p className="text-sm text-secondary mt-1">
              You currently have wallet-only access. Creating an account adds email authentication and profile features.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits of Creating Account */}
      <div className="feature-card mb-6">
        <h4 className="font-semibold mb-3">✨ Benefits of Creating an Account</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Save your preferences</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Email notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Portfolio tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Custom username</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Enhanced security</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Social features</span>
          </div>
        </div>
      </div>

      {/* Account Creation Form */}
      <div className="form-section">
        <div className="space-y-6">
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">Username *</label>
            <input
              type="text"
              value={userData.username}
              onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
              className="form-input-enhanced"
              placeholder="Choose a unique username"
              disabled={isCreatingAccount || firebaseLoading}
            />
          </div>
          
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">Email *</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
              className="form-input-enhanced"
              placeholder="your.email@example.com"
              disabled={isCreatingAccount || firebaseLoading}
            />
          </div>

          <div className="form-group-enhanced">
            <label className="form-label-enhanced">Password *</label>
            <input
              type="password"
              value={userData.password}
              onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
              className="form-input-enhanced"
              placeholder="At least 6 characters"
              disabled={isCreatingAccount || firebaseLoading}
            />
          </div>

          <div className="form-group-enhanced">
            <label className="form-label-enhanced">Bio (Optional)</label>
            <textarea
              value={userData.bio}
              onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
              className="form-input-enhanced"
              rows="3"
              placeholder="Tell us about yourself..."
              disabled={isCreatingAccount || firebaseLoading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="btn-enhanced btn-secondary-enhanced btn-medium"
            disabled={isCreatingAccount || firebaseLoading}
          >
            ← Skip for Now
          </button>
          <button
            onClick={handleCreateAccount}
            disabled={isCreatingAccount || firebaseLoading}
            className="btn-enhanced btn-primary-enhanced btn-medium flex-1"
          >
            {isCreatingAccount || firebaseLoading ? (
              <>
                <div className="loading-enhanced"></div>
                Creating Account...
              </>
            ) : (
              <>
                ✨ Create Account
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountManager