import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const StatsDisplay = ({ contracts, account }) => {
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
      <div className="card">
        <div className="loading" style={{ margin: '2rem auto' }}></div>
        <p>Loading stats...</p>
      </div>
    )
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{formatNumber(stats.totalStaked)}</div>
        <div className="stat-label">Total Staked (STK)</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{formatNumber(stats.userStaked)}</div>
        <div className="stat-label">Your Staked (STK)</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{formatNumber(stats.userRewards)}</div>
        <div className="stat-label">Pending Rewards (RWD)</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{formatNumber(stats.stakingTokenBalance)}</div>
        <div className="stat-label">STK Balance</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{formatNumber(stats.rewardTokenBalance)}</div>
        <div className="stat-label">RWD Balance</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-value">{stats.rewardRate}</div>
        <div className="stat-label">Reward Rate (per sec)</div>
      </div>
    </div>
  )
}

export default StatsDisplay