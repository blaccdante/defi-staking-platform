import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const AnalyticsDashboard = ({ contracts, account }) => {
  const [analytics, setAnalytics] = useState({
    totalEarned: '0',
    stakingHistory: [],
    performanceMetrics: {
      averageAPY: 0,
      totalDaysStaked: 0,
      bestPerformingPeriod: { period: 'N/A', apy: 0 },
      totalTransactions: 0
    },
    chartData: {
      earnings: [],
      stakingAmount: []
    }
  })
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (contracts && account) {
      loadAnalytics()
    }
  }, [contracts, account, timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Get current staking info
      const stakingInfo = await contracts.tokenStaking.getStakingInfo(account)
      const totalEarned = await contracts.tokenStaking.earned(account)
      
      // Calculate APY based on current rewards and staked amount
      const stakedAmount = parseFloat(ethers.formatEther(stakingInfo[0]))
      const earnedAmount = parseFloat(ethers.formatEther(totalEarned))
      const stakingTime = Number(stakingInfo[2])
      
      // Generate mock historical data for demonstration
      const mockAnalytics = generateMockAnalytics(stakedAmount, earnedAmount, stakingTime)
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockAnalytics = (stakedAmount, earnedAmount, stakingTime) => {
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90

    // Generate earnings history
    const earnings = []
    const stakingAmountHistory = []
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now - (i * dayMs))
      const progress = (days - i) / days
      
      // Simulate earnings growth
      const dailyEarning = earnedAmount * progress
      earnings.push({
        date: date.toLocaleDateString(),
        amount: dailyEarning,
        timestamp: date.getTime()
      })
      
      // Simulate staking amount (might have been added over time)
      const stakingProgress = Math.min(1, progress * 1.2) // Slightly front-loaded
      stakingAmountHistory.push({
        date: date.toLocaleDateString(),
        amount: stakedAmount * stakingProgress,
        timestamp: date.getTime()
      })
    }

    // Calculate performance metrics
    const totalDaysStaked = stakingTime > 0 ? Math.floor((now / 1000 - stakingTime) / (24 * 60 * 60)) : 0
    const averageAPY = stakedAmount > 0 && totalDaysStaked > 0 
      ? (earnedAmount / stakedAmount) * (365 / totalDaysStaked) * 100 
      : 0

    return {
      totalEarned: earnedAmount.toString(),
      stakingHistory: [
        {
          date: new Date(stakingTime * 1000).toLocaleDateString(),
          action: 'Stake',
          amount: stakedAmount,
          txHash: '0x1234...5678'
        }
      ],
      performanceMetrics: {
        averageAPY: Math.max(0, averageAPY),
        totalDaysStaked,
        bestPerformingPeriod: {
          period: 'Last 7 days',
          apy: Math.max(0, averageAPY * 1.2)
        },
        totalTransactions: 1 + (earnedAmount > 0 ? 1 : 0) // Stake + possible claim
      },
      chartData: {
        earnings,
        stakingAmount: stakingAmountHistory
      }
    }
  }

  const formatNumber = (num) => {
    const number = parseFloat(num)
    if (number === 0) return '0'
    if (number < 0.001) return '< 0.001'
    if (number < 1) return number.toFixed(4)
    return number.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const SimpleChart = ({ data, type = 'line', color = '#667eea' }) => {
    if (!data || data.length === 0) return <div className="text-center p-4">No data available</div>

    const maxValue = Math.max(...data.map(d => d.amount))
    const minValue = Math.min(...data.map(d => d.amount))
    const range = maxValue - minValue || 1

    return (
      <div className="chart-container" style={{ height: '200px', position: 'relative', padding: '20px' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 160" style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1={0}
              y1={y * 1.6}
              x2={400}
              y2={y * 1.6}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={0.5}
            />
          ))}
          
          {/* Chart line */}
          {type === 'line' && (
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.map((d, i) => {
                const x = (i / (data.length - 1)) * 400
                const y = 160 - ((d.amount - minValue) / range) * 140
                return `${x},${y}`
              }).join(' ')}
            />
          )}
          
          {/* Chart area */}
          {type === 'area' && (
            <>
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                  <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
                </linearGradient>
              </defs>
              <polygon
                fill="url(#chartGradient)"
                stroke={color}
                strokeWidth="2"
                points={
                  data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 400
                    const y = 160 - ((d.amount - minValue) / range) * 140
                    return `${x},${y}`
                  }).join(' ') + ` 400,160 0,160`
                }
              />
            </>
          )}
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 400
            const y = 160 - ((d.amount - minValue) / range) * 140
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            )
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div style={{ position: 'absolute', left: '-60px', top: '20px', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{formatNumber(maxValue)}</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{formatNumber((maxValue + minValue) / 2)}</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{formatNumber(minValue)}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="loading" style={{ margin: '2rem auto' }}></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-dashboard">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>📊 Staking Analytics</h2>
          <div className="time-range-selector">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'primary' : 'secondary'}
                style={{ 
                  padding: '0.5rem 1rem', 
                  margin: '0 0.25rem',
                  fontSize: '0.875rem'
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value">{formatNumber(analytics.totalEarned)}</div>
            <div className="stat-label">Total Earned (RWD)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analytics.performanceMetrics.averageAPY.toFixed(2)}%</div>
            <div className="stat-label">Average APY</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analytics.performanceMetrics.totalDaysStaked}</div>
            <div className="stat-label">Days Staking</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analytics.performanceMetrics.totalTransactions}</div>
            <div className="stat-label">Total Transactions</div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>💰 Rewards Over Time</h3>
            <SimpleChart 
              data={analytics.chartData.earnings} 
              type="area"
              color="#10b981"
            />
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>📈 Staking Amount</h3>
            <SimpleChart 
              data={analytics.chartData.stakingAmount} 
              type="line"
              color="#667eea"
            />
          </div>
        </div>

        {/* Performance Insights */}
        <div className="performance-insights">
          <h3 style={{ marginBottom: '1rem' }}>🎯 Performance Insights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div className="insight-card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.2rem' }}>📊</span>
                <strong style={{ color: '#10b981' }}>Best Period</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {analytics.performanceMetrics.bestPerformingPeriod.period}: {analytics.performanceMetrics.bestPerformingPeriod.apy.toFixed(2)}% APY
              </p>
            </div>
            
            <div className="insight-card" style={{ background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.2)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#667eea', fontSize: '1.2rem' }}>⏰</span>
                <strong style={{ color: '#667eea' }}>Staking Duration</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {analytics.performanceMetrics.totalDaysStaked} days of consistent staking
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {analytics.stakingHistory.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📝 Recent Activity</h3>
            <div className="activity-list">
              {analytics.stakingHistory.map((activity, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  marginBottom: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: activity.action === 'Stake' ? '#10b981' : '#667eea' }}>
                      {activity.action === 'Stake' ? '📥' : '📤'} {activity.action}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {activity.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600' }}>
                      {formatNumber(activity.amount)} STK
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
                      {activity.txHash}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsDashboard