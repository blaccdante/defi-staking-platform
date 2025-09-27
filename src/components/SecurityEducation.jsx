import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const SecurityEducation = ({ user }) => {
  const [securityDemo, setSecurityDemo] = useState({})
  const [attempts, setAttempts] = useState([])

  useEffect(() => {
    demonstrateSecurityBoundaries()
  }, [user])

  const demonstrateSecurityBoundaries = () => {
    const demo = {
      // ✅ What we CAN access (public information)
      canAccess: {
        address: user?.address || 'Not connected',
        walletType: user?.walletType || 'None',
        chainId: user?.chainId || 'None',
        timestamp: user?.timestamp ? new Date(user.timestamp).toLocaleString() : 'None',
        publicKey: user?.address ? 'Derived from address' : 'None',
        networkInfo: user?.chainId ? `Chain ${user.chainId}` : 'None'
      },
      // ❌ What we CANNOT access (and why)
      cannotAccess: {
        privateKey: 'NEVER transmitted to websites',
        seedPhrase: 'Only exists in wallet app',
        password: 'Only used locally in wallet',
        otherAccounts: 'Wallet isolates accounts',
        autoSigning: 'Each transaction requires approval',
        localStorage: 'Wallet data is encrypted'
      }
    }
    setSecurityDemo(demo)
  }

  const attemptSecurityViolations = async (attemptType) => {
    const attempt = { type: attemptType, timestamp: new Date().toLocaleString(), result: '' }
    
    try {
      switch (attemptType) {
        case 'privateKey':
          attempt.result = '❌ IMPOSSIBLE: Private keys are never exposed to JavaScript. They exist only in the wallet app\'s secure environment.'
          // This will always fail - there's no legitimate way to access private keys
          break
          
        case 'seedPhrase':
          attempt.result = '❌ IMPOSSIBLE: Seed phrases are generated and stored only in the wallet app. No web API provides access to them.'
          break
          
        case 'autoTransaction':
          attempt.result = '⚠️ BLOCKED: Attempting to send transaction without user approval...'
          try {
            // This will trigger the wallet popup - user must approve
            const tx = await user.signer.sendTransaction({
              to: user.address, // Send to self
              value: ethers.parseEther('0.001')
            })
            attempt.result = '⚠️ USER APPROVED: Transaction succeeded because user clicked "Confirm" in wallet popup'
          } catch (error) {
            attempt.result = `✅ BLOCKED: ${error.message} (User rejected or wallet blocked)`
          }
          break
          
        case 'accessOtherAccounts':
          attempt.result = '❌ IMPOSSIBLE: Wallets only expose the currently selected account. No API exists to list or access other accounts.'
          break
          
        case 'bypassSigning':
          attempt.result = '❌ IMPOSSIBLE: All transactions must be cryptographically signed. Cannot forge signatures without private key.'
          break
          
        case 'readWalletStorage':
          attempt.result = '❌ BLOCKED: Browser security model prevents websites from reading wallet extension storage.'
          break
          
        default:
          attempt.result = 'Unknown attempt type'
      }
    } catch (error) {
      attempt.result = `✅ BLOCKED: ${error.message}`
    }
    
    setAttempts(prev => [attempt, ...prev.slice(0, 4)]) // Keep last 5 attempts
  }

  const testLegitimateFunction = async (testType) => {
    const attempt = { type: testType, timestamp: new Date().toLocaleString(), result: '' }
    
    try {
      switch (testType) {
        case 'signMessage':
          const message = `Authentication test from DeFi Platform\nTimestamp: ${Date.now()}`
          const signature = await user.signer.signMessage(message)
          attempt.result = `✅ SUCCESS: Message signed (first 20 chars): ${signature.slice(0, 20)}...`
          break
          
        case 'getBalance':
          const balance = await user.provider.getBalance(user.address)
          attempt.result = `✅ SUCCESS: Public balance: ${ethers.formatEther(balance)} ETH`
          break
          
        case 'verifySignature':
          const testMessage = 'Test message'
          const testSig = await user.signer.signMessage(testMessage)
          const recovered = ethers.verifyMessage(testMessage, testSig)
          const isValid = recovered.toLowerCase() === user.address.toLowerCase()
          attempt.result = `✅ SUCCESS: Signature verification ${isValid ? 'VALID' : 'INVALID'}`
          break
          
        default:
          attempt.result = 'Unknown test type'
      }
    } catch (error) {
      attempt.result = `❌ FAILED: ${error.message}`
    }
    
    setAttempts(prev => [attempt, ...prev.slice(0, 4)])
  }

  if (!user) {
    return (
      <div className="feature-card">
        <h3 className="text-xl font-semibold mb-4">🎓 Wallet Security Education</h3>
        <p className="text-secondary">Connect a wallet to see security demonstrations</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="section-header">
        <h2 className="section-title">🎓 Web3 Security Education</h2>
        <p className="section-subtitle">
          Understanding what DeFi platforms can and cannot access from your wallet
        </p>
      </div>

      {/* What we CAN access */}
      <div className="feature-card">
        <h3 className="text-xl font-semibold mb-4 text-green-500">✅ Public Information We Can Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(securityDemo.canAccess || {}).map(([key, value]) => (
            <div key={key} className="bg-green-50 dark:bg-green-900 p-3 rounded">
              <div className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              <div className="text-sm text-secondary">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-secondary">
          ℹ️ This information is public on the blockchain and safe for websites to access
        </div>
      </div>

      {/* What we CANNOT access */}
      <div className="feature-card">
        <h3 className="text-xl font-semibold mb-4 text-red-500">❌ Private Information We CANNOT Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(securityDemo.cannotAccess || {}).map(([key, value]) => (
            <div key={key} className="bg-red-50 dark:bg-red-900 p-3 rounded">
              <div className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              <div className="text-sm text-secondary">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-secondary">
          🛡️ These are protected by wallet security and browser isolation
        </div>
      </div>

      {/* Security Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legitimate Functions */}
        <div className="feature-card">
          <h3 className="text-lg font-semibold mb-4 text-blue-500">✅ Legitimate Functions</h3>
          <div className="space-y-2">
            <button
              onClick={() => testLegitimateFunction('signMessage')}
              className="btn-enhanced btn-primary-enhanced btn-small w-full"
            >
              🖊️ Request Message Signature
            </button>
            <button
              onClick={() => testLegitimateFunction('getBalance')}
              className="btn-enhanced btn-primary-enhanced btn-small w-full"
            >
              💰 Read Public Balance
            </button>
            <button
              onClick={() => testLegitimateFunction('verifySignature')}
              className="btn-enhanced btn-primary-enhanced btn-small w-full"
            >
              ✅ Verify Signature
            </button>
          </div>
        </div>

        {/* Security Violation Attempts */}
        <div className="feature-card">
          <h3 className="text-lg font-semibold mb-4 text-red-500">⚠️ Security Violation Attempts</h3>
          <div className="space-y-2">
            <button
              onClick={() => attemptSecurityViolations('privateKey')}
              className="btn-enhanced btn-secondary-enhanced btn-small w-full"
            >
              🔑 Try to Access Private Key
            </button>
            <button
              onClick={() => attemptSecurityViolations('seedPhrase')}
              className="btn-enhanced btn-secondary-enhanced btn-small w-full"
            >
              📝 Try to Read Seed Phrase
            </button>
            <button
              onClick={() => attemptSecurityViolations('autoTransaction')}
              className="btn-enhanced btn-secondary-enhanced btn-small w-full"
            >
              💸 Try Auto-Transaction
            </button>
          </div>
          <div className="text-xs text-secondary mt-2">
            These will fail - demonstrating wallet security
          </div>
        </div>
      </div>

      {/* Results Log */}
      <div className="feature-card">
        <h3 className="text-lg font-semibold mb-4">📊 Security Test Results</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {attempts.length === 0 ? (
            <div className="text-secondary text-center py-4">
              No tests run yet. Try the buttons above to see how wallet security works.
            </div>
          ) : (
            attempts.map((attempt, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                <div className="flex justify-between items-start mb-1">
                  <strong className="capitalize">{attempt.type.replace(/([A-Z])/g, ' $1')}</strong>
                  <span className="text-xs text-secondary">{attempt.timestamp}</span>
                </div>
                <div className={`text-xs ${attempt.result.includes('✅') || attempt.result.includes('SUCCESS') ? 'text-green-600' : 
                  attempt.result.includes('❌') || attempt.result.includes('IMPOSSIBLE') ? 'text-red-600' : 'text-yellow-600'}`}>
                  {attempt.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Educational Summary */}
      <div className="feature-card bg-blue-50 dark:bg-blue-900">
        <h3 className="text-lg font-semibold mb-4">🎯 Key Security Lessons</h3>
        <div className="space-y-2 text-sm">
          <div>• <strong>Private keys never leave your wallet</strong> - This is enforced by browser security and wallet design</div>
          <div>• <strong>Every transaction requires your approval</strong> - Websites cannot send transactions automatically</div>
          <div>• <strong>Signatures prove ownership</strong> - Without revealing sensitive information</div>
          <div>• <strong>Trust model works</strong> - You trust your wallet, your wallet doesn't fully trust websites</div>
          <div>• <strong>Public data is safe to share</strong> - Addresses, balances, and transaction history are public anyway</div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded">
          <div className="text-sm">
            <strong>🚨 Remember:</strong> Legitimate DeFi platforms will NEVER ask for private keys or seed phrases. 
            If any website asks for this information, it's a scam!
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityEducation