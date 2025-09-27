import React, { useState } from 'react'
import { MobileForm, MobileInput, MobileTextarea, MobileButton } from '../MobileForm'
import { useWallet } from '../../contexts/WalletContext'
import { ethers } from 'ethers'

const StakingForm = () => {
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('30')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { connected, address, provider } = useWallet()
  
  // Staking APY calculator
  const calculateApy = (days) => {
    // Example APY calculation - base of 5% + bonus based on duration
    const baseApy = 5
    const durationBonus = days * 0.05
    return baseApy + durationBonus
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset states
    setError('')
    setSuccess('')
    
    // Validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid staking amount')
      return
    }
    
    if (!connected) {
      setError('Please connect your wallet first')
      return
    }
    
    setLoading(true)
    
    try {
      // Simulate blockchain interaction with timeout
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Example: Here you would call your staking contract
      // const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider.getSigner())
      // const tx = await stakingContract.stake(ethers.utils.parseEther(amount), duration)
      // await tx.wait()
      
      setSuccess(`Successfully staked ${amount} tokens for ${duration} days!`)
      
      // Reset form
      setAmount('')
      setDuration('30')
      setNote('')
    } catch (err) {
      console.error('Staking error:', err)
      setError('Failed to stake tokens. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="staking-form-container">
      <h2 className="staking-title">Stake Your Tokens</h2>
      
      <div className="apy-display">
        <div className="apy-card">
          <span className="apy-label">Current APY</span>
          <span className="apy-value">{calculateApy(parseInt(duration))}%</span>
          <span className="apy-sublabel">For {duration} days lock period</span>
        </div>
      </div>
      
      <MobileForm onSubmit={handleSubmit}>
        <MobileInput
          label="Amount to Stake"
          type="number"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        
        <div className="duration-selector">
          <label className="form-label-enhanced">Staking Period</label>
          
          <div className="duration-options">
            {['30', '60', '90', '180', '365'].map((days) => (
              <button
                key={days}
                type="button"
                className={`duration-option ${duration === days ? 'active' : ''}`}
                onClick={() => setDuration(days)}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
        
        <MobileTextarea
          label="Note (Optional)"
          placeholder="Add a personal note to your stake..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
        
        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <span>✅</span> {success}
          </div>
        )}
        
        <div className="form-actions">
          <MobileButton 
            type="submit"
            loading={loading}
            disabled={!connected || loading}
            fullWidth
            size="large"
          >
            {connected ? 'Stake Now' : 'Connect Wallet First'}
          </MobileButton>
          
          {connected && (
            <div className="wallet-info">
              <span className="wallet-address">Connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
            </div>
          )}
        </div>
      </MobileForm>
      
      <style jsx>{`
        .staking-form-container {
          background: var(--glass-bg);
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
          padding: var(--space-6);
          max-width: 500px;
          margin: 0 auto;
          box-shadow: var(--shadow-lg);
        }
        
        .staking-title {
          text-align: center;
          margin-bottom: var(--space-6);
          font-size: 1.75rem;
          font-weight: 700;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .apy-display {
          margin-bottom: var(--space-6);
        }
        
        .apy-card {
          background: var(--color-primary-light);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .apy-label {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }
        
        .apy-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-2);
        }
        
        .apy-sublabel {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .duration-selector {
          margin-bottom: var(--space-4);
        }
        
        .duration-options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }
        
        .duration-option {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .duration-option:hover {
          border-color: var(--color-primary-light);
        }
        
        .duration-option.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        
        .form-actions {
          margin-top: var(--space-6);
        }
        
        .wallet-info {
          display: flex;
          justify-content: center;
          margin-top: var(--space-4);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .wallet-address {
          background: var(--glass-bg);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          border: 1px solid var(--glass-border);
        }
        
        .error-message {
          color: var(--color-error);
          font-size: 0.875rem;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background: rgba(var(--color-error-rgb), 0.1);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }
        
        .success-message {
          color: var(--color-success);
          font-size: 0.875rem;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background: rgba(var(--color-success-rgb), 0.1);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }
        
        @media (max-width: 768px) {
          .staking-form-container {
            padding: var(--space-4);
            margin: 0 var(--space-2);
            max-width: 100%;
          }
          
          .staking-title {
            font-size: 1.5rem;
            margin-bottom: var(--space-4);
          }
          
          .duration-options {
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-2);
          }
          
          .duration-option {
            flex: 1;
            min-width: 0;
            text-align: center;
            padding: var(--space-2);
            font-size: 0.75rem;
          }
        }
        
        @media (max-width: 480px) {
          .duration-options {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-2);
          }
        }
      `}</style>
    </div>
  )
}

export default StakingForm