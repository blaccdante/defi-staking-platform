import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const StatsDisplay = ({ contracts, account }) => {
  // Professional Icons
  const TotalStakedIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )

  const UserStakedIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )

  const RewardsIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  )

  const WalletIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )

  const RateIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
  const [stats, setStats] = useState({
    totalStaked: '0',
    userStaked: '0',
    userRewards: '0',
    stakingTokenBalance: '0',
    rewardTokenBalance: '0',
    rewardRate: '0'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (contracts && account) {
      loadStats()
      
      // Set up interval to refresh stats every 10 seconds
      const interval = setInterval(loadStats, 10000)
      return () => clearInterval(interval)
    }
  }, [contracts, account])

  const loadStats = async () => {
    try {
      const [
        totalStaked,
        userStaked,
        userRewards,
        stakingTokenBalance,
        rewardTokenBalance,
        rewardRate
      ] = await Promise.all([
        contracts.tokenStaking.totalStaked(),
        contracts.tokenStaking.stakedBalance(account),
        contracts.tokenStaking.earned(account),
        contracts.stakingToken.balanceOf(account),
        contracts.rewardToken.balanceOf(account),
        contracts.tokenStaking.rewardRate()
      ])

      setStats({
        totalStaked: ethers.formatEther(totalStaked),
        userStaked: ethers.formatEther(userStaked),
        userRewards: ethers.formatEther(userRewards),
        stakingTokenBalance: ethers.formatEther(stakingTokenBalance),
        rewardTokenBalance: ethers.formatEther(rewardTokenBalance),
        rewardRate: rewardRate.toString()
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    const number = parseFloat(num)
    if (number === 0) return '0'
    if (number < 0.001) return '< 0.001'
    if (number < 1) return number.toFixed(4)
    return number.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  if (loading) {
    return (
      <div className="responsive-grid-3">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="stat-card-enhanced">
            <div className="loading-skeleton" style={{ height: '2rem', marginBottom: 'var(--space-2)' }}></div>
            <div className="loading-skeleton" style={{ height: '1rem' }}></div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      icon: <TotalStakedIcon />,
      value: formatNumber(stats.totalStaked),
      label: 'Total Staked (STK)',
      color: 'var(--info-text)',
      bg: 'var(--info-bg)'
    },
    {
      icon: <UserStakedIcon />,
      value: formatNumber(stats.userStaked),
      label: 'Your Staked (STK)',
      color: 'var(--success-text)',
      bg: 'var(--success-bg)'
    },
    {
      icon: <RewardsIcon />,
      value: formatNumber(stats.userRewards),
      label: 'Pending Rewards (RWD)',
      color: 'var(--warning-text)',
      bg: 'var(--warning-bg)'
    },
    {
      icon: <WalletIcon />,
      value: formatNumber(stats.stakingTokenBalance),
      label: 'STK Balance',
      color: 'var(--info-text)',
      bg: 'var(--info-bg)'
    },
    {
      icon: <WalletIcon />,
      value: formatNumber(stats.rewardTokenBalance),
      label: 'RWD Balance',
      color: 'var(--success-text)',
      bg: 'var(--success-bg)'
    },
    {
      icon: <RateIcon />,
      value: stats.rewardRate,
      label: 'Reward Rate (per sec)',
      color: 'var(--warning-text)',
      bg: 'var(--warning-bg)'
    }
  ]

  return (
    <div className="responsive-grid-3">
      {statCards.map((stat, index) => (
        <div key={index} className="stat-card-enhanced" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="feature-icon" style={{ width: '48px', height: '48px', background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="text-xs text-gradient-primary font-mono font-semibold">LIVE</div>
          </div>
          <div className="stat-value-large">{stat.value}</div>
          <div className="stat-label-enhanced">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsDisplay