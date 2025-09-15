import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'

const StakingInterface = ({ contracts, account }) => {
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
    <div className="staking-grid">
      {/* Stake Section */}
      <div className="card">
        <h3>💰 Stake Tokens</h3>
        <p>Stake your STK tokens to earn RWD rewards</p>
        
        <div className="form-group">
          <label>Amount to Stake (STK)</label>
          <div className="input-group">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount..."
              min="0"
              step="0.01"
            />
            <button 
              onClick={handleStake}
              disabled={loading.stake}
              className="primary"
            >
              {loading.stake ? <div className="loading"></div> : 'Stake'}
            </button>
          </div>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="card">
        <h3>🏦 Withdraw Tokens</h3>
        <p>Withdraw your staked tokens (min 7 days)</p>
        
        <div className="form-group">
          <label>Amount to Withdraw (STK)</label>
          <div className="input-group">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount..."
              min="0"
              step="0.01"
              max={stakingInfo.staked}
            />
            <button 
              onClick={handleWithdraw}
              disabled={loading.withdraw || !stakingInfo.canWithdraw}
              className="secondary"
            >
              {loading.withdraw ? <div className="loading"></div> : 'Withdraw'}
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <div>Staked: {formatNumber(stakingInfo.staked)} STK</div>
          <div className={stakingInfo.canWithdraw ? 'can-withdraw' : 'countdown'}>
            {getRemainingTime()}
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="card" style={{ gridColumn: 'span 2' }}>
        <h3>🎁 Claim Rewards</h3>
        <p>Claim your accumulated RWD rewards</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
              {formatNumber(stakingInfo.earned)} RWD
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Available to claim
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={handleClaimRewards}
              disabled={loading.claim || parseFloat(stakingInfo.earned) <= 0}
              className="primary"
            >
              {loading.claim ? <div className="loading"></div> : 'Claim Rewards'}
            </button>
            
            <button 
              onClick={handleExit}
              disabled={loading.exit || !stakingInfo.canWithdraw || parseFloat(stakingInfo.staked) <= 0}
              className="secondary"
            >
              {loading.exit ? <div className="loading"></div> : 'Exit (Withdraw All + Claim)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StakingInterface