import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'

const StakingPools = ({ contracts, account }) => {
  const [pools, setPools] = useState([])
  const [selectedPool, setSelectedPool] = useState(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [loading, setLoading] = useState({})

  useEffect(() => {
    initializePools()
  }, [])

  const initializePools = () => {
    // Mock staking pools with different characteristics
    const mockPools = [
      {
        id: 'flexible',
        name: 'Flexible Pool',
        description: 'Stake and withdraw anytime with standard rewards',
        apy: 15.5,
        lockPeriod: 0,
        minStake: 0.1,
        maxStake: 10000,
        totalStaked: 125000,
        totalCapacity: 500000,
        rewardToken: 'RWD',
        isActive: true,
        features: ['No lock period', 'Standard APY', 'Withdraw anytime'],
        icon: '🔄',
        color: '#10b981'
      },
      {
        id: 'bronze',
        name: 'Bronze Pool',
        description: '30-day lock period with higher rewards',
        apy: 25.0,
        lockPeriod: 30,
        minStake: 1.0,
        maxStake: 50000,
        totalStaked: 87500,
        totalCapacity: 200000,
        rewardToken: 'RWD',
        isActive: true,
        features: ['30-day lock', 'Higher APY', 'Bonus rewards'],
        icon: '🥉',
        color: '#f59e0b'
      },
      {
        id: 'silver',
        name: 'Silver Pool',
        description: '90-day lock period with premium rewards',
        apy: 40.0,
        lockPeriod: 90,
        minStake: 5.0,
        maxStake: 100000,
        totalStaked: 45000,
        totalCapacity: 100000,
        rewardToken: 'RWD',
        isActive: true,
        features: ['90-day lock', 'Premium APY', 'Weekly bonuses'],
        icon: '🥈',
        color: '#667eea'
      },
      {
        id: 'gold',
        name: 'Gold Pool',
        description: '180-day lock period with maximum rewards',
        apy: 60.0,
        lockPeriod: 180,
        minStake: 10.0,
        maxStake: 200000,
        totalStaked: 25000,
        totalCapacity: 50000,
        rewardToken: 'RWD',
        isActive: true,
        features: ['180-day lock', 'Maximum APY', 'Daily compounding', 'NFT rewards'],
        icon: '🥇',
        color: '#f093fb'
      },
      {
        id: 'diamond',
        name: 'Diamond Pool',
        description: 'Coming soon - Exclusive high-tier staking',
        apy: 100.0,
        lockPeriod: 365,
        minStake: 50.0,
        maxStake: 500000,
        totalStaked: 0,
        totalCapacity: 25000,
        rewardToken: 'RWD',
        isActive: false,
        features: ['365-day lock', 'Exclusive APY', 'VIP benefits', 'Governance rights'],
        icon: '💎',
        color: '#a855f7'
      }
    ]

    setPools(mockPools)
  }

  const handleStakeInPool = async (pool) => {
    if (!stakeAmount || parseFloat(stakeAmount) < pool.minStake) {
      toast.error(`Minimum stake is ${pool.minStake} STK`)
      return
    }

    if (parseFloat(stakeAmount) > pool.maxStake) {
      toast.error(`Maximum stake is ${pool.maxStake} STK`)
      return
    }

    setLoading({ ...loading, [pool.id]: true })
    
    try {
      // For now, use the existing staking contract
      // In a real implementation, you'd have multiple pool contracts
      const amount = ethers.parseEther(stakeAmount)
      
      // Check allowance
      const allowance = await contracts.stakingToken.allowance(account, await contracts.tokenStaking.getAddress())
      
      if (allowance < amount) {
        toast.loading('Approving tokens...', { id: 'approve' })
        
        const approveTx = await contracts.stakingToken.approve(
          await contracts.tokenStaking.getAddress(),
          amount
        )
        await approveTx.wait()
        
        toast.success('Tokens approved!', { id: 'approve' })
      }
      
      toast.loading(`Staking in ${pool.name}...`, { id: 'stake' })
      
      // Stake tokens (using existing contract for demo)
      const stakeTx = await contracts.tokenStaking.stake(amount)
      await stakeTx.wait()
      
      toast.success(`Successfully staked in ${pool.name}!`, { id: 'stake' })
      setStakeAmount('')
      setSelectedPool(null)
      
    } catch (error) {
      console.error('Error staking in pool:', error)
      toast.error(error.reason || 'Failed to stake in pool')
      toast.dismiss('approve')
      toast.dismiss('stake')
    } finally {
      setLoading({ ...loading, [pool.id]: false })
    }
  }

  const calculateAPR = (apy) => {
    // Convert APY to APR (simple approximation)
    return (apy * 0.95).toFixed(1)
  }

  const getPoolUtilization = (pool) => {
    return Math.min(100, (pool.totalStaked / pool.totalCapacity) * 100)
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const StakeModal = ({ pool, onClose }) => {
    const [amount, setAmount] = useState('')
    const projectedDaily = amount ? (parseFloat(amount) * pool.apy / 365 / 100).toFixed(4) : '0'
    const projectedMonthly = amount ? (parseFloat(amount) * pool.apy / 12 / 100).toFixed(2) : '0'

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{pool.icon}</span>
              Stake in {pool.name}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: pool.color }}>{pool.apy}%</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>APY</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: pool.color }}>{pool.lockPeriod}</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Days Lock</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Amount to Stake (STK)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${pool.minStake} STK`}
                min={pool.minStake}
                max={pool.maxStake}
                step="0.01"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem' }}>
                <span>Min: {pool.minStake} STK</span>
                <span>Max: {formatNumber(pool.maxStake)} STK</span>
              </div>
            </div>

            {amount && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>💰 Projected Rewards</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{projectedDaily} RWD</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Daily</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{projectedMonthly} RWD</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Monthly</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setStakeAmount(amount)
                  handleStakeInPool(pool)
                }}
                disabled={!amount || parseFloat(amount) < pool.minStake || loading[pool.id]}
                className="primary"
                style={{ flex: 1, padding: '1rem' }}
              >
                {loading[pool.id] ? <div className="loading"></div> : 'Stake Now'}
              </button>
              <button
                onClick={onClose}
                className="secondary"
                style={{ flex: 1, padding: '1rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="staking-pools">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>🏊‍♂️ Staking Pools</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
          Choose from multiple staking pools with different reward rates and lock periods
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {pools.map((pool) => (
          <div
            key={pool.id}
            className="card"
            style={{
              position: 'relative',
              opacity: pool.isActive ? 1 : 0.6,
              background: pool.isActive 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(255, 255, 255, 0.04)',
              margin: 0
            }}
          >
            {/* Pool Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{pool.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{pool.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {pool.description}
                  </p>
                </div>
              </div>
              {!pool.isActive && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  COMING SOON
                </div>
              )}
            </div>

            {/* Pool Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: pool.color }}>
                  {pool.apy}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>APY</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: pool.color }}>
                  {pool.lockPeriod}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Days Lock</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: pool.color }}>
                  {formatNumber(pool.minStake)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Min Stake</div>
              </div>
            </div>

            {/* Pool Utilization */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem' }}>Pool Utilization</span>
                <span style={{ fontSize: '0.875rem', color: pool.color }}>
                  {formatNumber(pool.totalStaked)} / {formatNumber(pool.totalCapacity)} STK
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${getPoolUtilization(pool)}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${pool.color}, ${pool.color}88)`,
                    borderRadius: '3px',
                    transition: 'width 1s ease'
                  }}
                />
              </div>
            </div>

            {/* Pool Features */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Features:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {pool.features.map((feature, index) => (
                  <span
                    key={index}
                    style={{
                      background: `${pool.color}20`,
                      color: pool.color,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSelectedPool(pool)}
              disabled={!pool.isActive}
              className="primary"
              style={{
                width: '100%',
                padding: '1rem',
                background: pool.isActive
                  ? `linear-gradient(135deg, ${pool.color}, ${pool.color}cc)`
                  : 'rgba(255, 255, 255, 0.1)',
                cursor: pool.isActive ? 'pointer' : 'not-allowed'
              }}
            >
              {pool.isActive ? 'Stake Now' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>

      {/* Stake Modal */}
      {selectedPool && (
        <StakeModal
          pool={selectedPool}
          onClose={() => setSelectedPool(null)}
        />
      )}
    </div>
  )
}

export default StakingPools