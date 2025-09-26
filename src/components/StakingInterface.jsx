import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'

const StakingInterface = ({ contracts, account }) => {
  // Professional Icons
  const StakeIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  )

  const WithdrawIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )

  const RewardIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  )

  const ClockIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const CheckIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [loading, setLoading] = useState({})
  const [stakingInfo, setStakingInfo] = useState({
    staked: '0',
    earned: '0',
    stakingTime: 0,
    canWithdraw: false
  })

  useEffect(() => {
    if (contracts && account) {
      loadStakingInfo()
      
      // Refresh staking info every 10 seconds
      const interval = setInterval(loadStakingInfo, 10000)
      return () => clearInterval(interval)
    }
  }, [contracts, account])

  const loadStakingInfo = async () => {
    try {
      const info = await contracts.tokenStaking.getStakingInfo(account)
      setStakingInfo({
        staked: ethers.formatEther(info[0]),
        earned: ethers.formatEther(info[1]),
        stakingTime: Number(info[2]),
        canWithdraw: info[3]
      })
    } catch (error) {
      console.error('Error loading staking info:', error)
    }
  }

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount to stake')
      return
    }

    setLoading({ ...loading, stake: true })
    
    try {
      const amount = ethers.parseEther(stakeAmount)
      
      // Check allowance
      const allowance = await contracts.stakingToken.allowance(account, await contracts.tokenStaking.getAddress())
      
      if (allowance < amount) {
        toast.loading('Approving tokens...', { id: 'approve' })
        
        // Approve tokens
        const approveTx = await contracts.stakingToken.approve(
          await contracts.tokenStaking.getAddress(),
          amount
        )
        await approveTx.wait()
        
        toast.success('Tokens approved!', { id: 'approve' })
      }
      
      toast.loading('Staking tokens...', { id: 'stake' })
      
      // Stake tokens
      const stakeTx = await contracts.tokenStaking.stake(amount)
      await stakeTx.wait()
      
      toast.success('Tokens staked successfully!', { id: 'stake' })
      setStakeAmount('')
      loadStakingInfo()
      
    } catch (error) {
      console.error('Error staking:', error)
      toast.error(error.reason || 'Failed to stake tokens')
      toast.dismiss('approve')
      toast.dismiss('stake')
    } finally {
      setLoading({ ...loading, stake: false })
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount to withdraw')
      return
    }

    if (!stakingInfo.canWithdraw) {
      toast.error('Minimum staking period not met (7 days)')
      return
    }

    setLoading({ ...loading, withdraw: true })
    
    try {
      const amount = ethers.parseEther(withdrawAmount)
      
      toast.loading('Withdrawing tokens...', { id: 'withdraw' })
      
      const withdrawTx = await contracts.tokenStaking.withdraw(amount)
      await withdrawTx.wait()
      
      toast.success('Tokens withdrawn successfully!', { id: 'withdraw' })
      setWithdrawAmount('')
      loadStakingInfo()
      
    } catch (error) {
      console.error('Error withdrawing:', error)
      toast.error(error.reason || 'Failed to withdraw tokens')
      toast.dismiss('withdraw')
    } finally {
      setLoading({ ...loading, withdraw: false })
    }
  }

  const handleClaimRewards = async () => {
    if (parseFloat(stakingInfo.earned) <= 0) {
      toast.error('No rewards to claim')
      return
    }

    setLoading({ ...loading, claim: true })
    
    try {
      toast.loading('Claiming rewards...', { id: 'claim' })
      
      const claimTx = await contracts.tokenStaking.claimReward()
      await claimTx.wait()
      
      toast.success('Rewards claimed successfully!', { id: 'claim' })
      loadStakingInfo()
      
    } catch (error) {
      console.error('Error claiming rewards:', error)
      toast.error(error.reason || 'Failed to claim rewards')
      toast.dismiss('claim')
    } finally {
      setLoading({ ...loading, claim: false })
    }
  }

  const handleExit = async () => {
    if (!stakingInfo.canWithdraw) {
      toast.error('Minimum staking period not met (7 days)')
      return
    }

    if (parseFloat(stakingInfo.staked) <= 0) {
      toast.error('No tokens staked')
      return
    }

    setLoading({ ...loading, exit: true })
    
    try {
      toast.loading('Exiting (withdrawing all + claiming rewards)...', { id: 'exit' })
      
      const exitTx = await contracts.tokenStaking.exit()
      await exitTx.wait()
      
      toast.success('Successfully exited staking!', { id: 'exit' })
      loadStakingInfo()
      
    } catch (error) {
      console.error('Error exiting:', error)
      toast.error(error.reason || 'Failed to exit staking')
      toast.dismiss('exit')
    } finally {
      setLoading({ ...loading, exit: false })
    }
  }

  const formatNumber = (num) => {
    const number = parseFloat(num)
    if (number === 0) return '0'
    if (number < 0.001) return '< 0.001'
    if (number < 1) return number.toFixed(4)
    return number.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const getRemainingTime = () => {
    if (stakingInfo.stakingTime === 0) return 'Not staking'
    if (stakingInfo.canWithdraw) return 'Can withdraw'
    
    const stakingTimeMs = stakingInfo.stakingTime * 1000
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    const unlockTime = stakingTimeMs + sevenDaysMs
    const now = Date.now()
    
    if (now >= unlockTime) return 'Can withdraw'
    
    const remaining = unlockTime - now
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
    
    return `${days}d ${hours}h ${minutes}m remaining`
  }

  return (
    <div className="responsive-grid-2">
      {/* Stake Section */}
      <div className="form-section">
        <div className="flex items-center gap-3 mb-6">
          <div className="feature-icon" style={{ width: '48px', height: '48px', background: 'var(--success-bg)', color: 'var(--success-text)' }}>
            <StakeIcon />
          </div>
          <div>
            <h3 className="form-title mb-2">Stake Tokens</h3>
            <p className="text-sm text-secondary mb-0">Stake STK tokens to earn RWD rewards</p>
          </div>
        </div>
        
        <div className="form-group-enhanced">
          <label className="form-label-enhanced">Amount to Stake (STK)</label>
          <div className="input-group">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount..."
              min="0"
              step="0.01"
              className="form-input-enhanced"
            />
            <button 
              onClick={handleStake}
              disabled={loading.stake}
              className="btn-enhanced btn-primary-enhanced btn-medium"
            >
              {loading.stake ? <div className="loading-enhanced"></div> : (
                <>
                  <StakeIcon />
                  Stake
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="form-section">
        <div className="flex items-center gap-3 mb-6">
          <div className="feature-icon" style={{ width: '48px', height: '48px', background: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
            <WithdrawIcon />
          </div>
          <div>
            <h3 className="form-title mb-2">Withdraw Tokens</h3>
            <p className="text-sm text-secondary mb-0">Withdraw your staked tokens (min 7 days)</p>
          </div>
        </div>
        
        <div className="form-group-enhanced">
          <label className="form-label-enhanced">Amount to Withdraw (STK)</label>
          <div className="input-group">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount..."
              min="0"
              step="0.01"
              max={stakingInfo.staked}
              className="form-input-enhanced"
            />
            <button 
              onClick={handleWithdraw}
              disabled={loading.withdraw || !stakingInfo.canWithdraw}
              className="btn-enhanced btn-secondary-enhanced btn-medium"
            >
              {loading.withdraw ? <div className="loading-enhanced"></div> : (
                <>
                  <WithdrawIcon />
                  Withdraw
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Staking Status */}
        <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-secondary">Staked Balance</span>
            <span className="font-mono font-semibold">{formatNumber(stakingInfo.staked)} STK</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary">Lock Status</span>
            <div className="flex items-center gap-2">
              {stakingInfo.canWithdraw ? (
                <>
                  <CheckIcon />
                  <span className="status-badge status-success">Can Withdraw</span>
                </>
              ) : (
                <>
                  <ClockIcon />
                  <span className="status-badge status-warning">{getRemainingTime()}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Section - Full Width */}
      <div className="form-section" style={{ gridColumn: 'span 2' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="feature-icon" style={{ width: '48px', height: '48px', background: 'var(--info-bg)', color: 'var(--info-text)' }}>
            <RewardIcon />
          </div>
          <div>
            <h3 className="form-title mb-2">Claim Rewards</h3>
            <p className="text-sm text-secondary mb-0">Claim your accumulated RWD rewards</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rewards Display */}
          <div className="text-center p-6 rounded-xl" style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)' }}>
            <div className="mb-2">
              <div className="text-3xl font-bold font-mono" style={{ background: 'var(--brand-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {formatNumber(stakingInfo.earned)}
              </div>
              <div className="text-sm font-medium text-secondary">RWD Available</div>
            </div>
            <div className="progress-bar mb-3">
              <div 
                className="progress-fill" 
                style={{ width: parseFloat(stakingInfo.earned) > 0 ? '100%' : '0%' }}
              ></div>
            </div>
            <div className="text-xs text-tertiary">Rewards update in real-time</div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 justify-center">
            <button 
              onClick={handleClaimRewards}
              disabled={loading.claim || parseFloat(stakingInfo.earned) <= 0}
              className="btn-enhanced btn-primary-enhanced btn-large"
            >
              {loading.claim ? <div className="loading-enhanced"></div> : (
                <>
                  <RewardIcon />
                  Claim Rewards
                </>
              )}
            </button>
            
            <button 
              onClick={handleExit}
              disabled={loading.exit || !stakingInfo.canWithdraw || parseFloat(stakingInfo.staked) <= 0}
              className="btn-enhanced btn-secondary-enhanced btn-large"
            >
              {loading.exit ? <div className="loading-enhanced"></div> : (
                <>
                  <WithdrawIcon />
                  Exit Staking
                </>
              )}
            </button>
            
            <div className="text-xs text-tertiary text-center mt-2">
              Exit withdraws all staked tokens and claims all rewards
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StakingInterface