import React from 'react'

const WalletConnect = ({ onConnect, loading }) => {
  return (
    <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Connect Your Wallet</h2>
      <p>Connect your MetaMask wallet to start staking tokens and earning rewards.</p>
      
      <div style={{ margin: '2rem 0' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ margin: '0 auto', display: 'block' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#667eea" strokeWidth="2"/>
          <path d="M30 45 L50 25 L70 45 L50 55 Z" fill="#667eea"/>
          <circle cx="50" cy="70" r="8" fill="#764ba2"/>
        </svg>
      </div>

      <button 
        onClick={onConnect}
        disabled={loading}
        className="primary"
        style={{ 
          width: '100%', 
          padding: '1rem 2rem', 
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {loading ? (
          <>
            <div className="loading"></div>
            Connecting...
          </>
        ) : (
          <>
            🦊 Connect MetaMask
          </>
        )}
      </button>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
        <p>Don't have MetaMask?</p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#667eea', textDecoration: 'none' }}
        >
          Download MetaMask →
        </a>
      </div>
    </div>
  )
}

export default WalletConnect