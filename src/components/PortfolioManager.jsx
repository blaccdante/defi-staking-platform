import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const PortfolioManager = ({ account, user }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    totalPnl: 0,
    totalPnlPercentage: 0,
    assets: []
  })
  const [transactions, setTransactions] = useState([])
  const [performance, setPerformance] = useState({
    chartData: [],
    metrics: {}
  })
  const [loading, setLoading] = useState(true)

  // Mock portfolio data
  const mockPortfolioData = {
    totalValue: 15847.23,
    totalPnl: 2847.92,
    totalPnlPercentage: 21.87,
    assets: [
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 5.234,
        value: 13802.45,
        purchasePrice: 2450.00,
        currentPrice: 2634.92,
        pnl: 964.37,
        pnlPercentage: 7.54,
        allocation: 87.1,
        icon: 'Ξ'
      },
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 0.0234,
        value: 1012.27,
        purchasePrice: 41200.00,
        currentPrice: 43250.87,
        pnl: 47.98,
        pnlPercentage: 4.98,
        allocation: 6.4,
        icon: '₿'
      },
      {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'BNB',
        balance: 3.421,
        value: 1069.36,
        purchasePrice: 298.50,
        currentPrice: 312.45,
        pnl: 47.74,
        pnlPercentage: 4.67,
        allocation: 6.8,
        icon: '🟡'
      }
    ]
  }

  const mockTransactions = [
    {
      id: '1',
      type: 'buy',
      asset: 'ETH',
      amount: 2.5,
      price: 2580.00,
      value: 6450.00,
      timestamp: Date.now() - 86400000,
      txHash: '0x1234...5678',
      status: 'completed'
    },
    {
      id: '2',
      type: 'sell',
      asset: 'BTC',
      amount: 0.1,
      price: 42800.00,
      value: 4280.00,
      timestamp: Date.now() - 172800000,
      txHash: '0x8765...4321',
      status: 'completed'
    },
    {
      id: '3',
      type: 'stake',
      asset: 'ETH',
      amount: 1.0,
      price: 2634.92,
      value: 2634.92,
      timestamp: Date.now() - 259200000,
      txHash: '0x9876...1234',
      status: 'completed'
    },
    {
      id: '4',
      type: 'swap',
      asset: 'USDT → BNB',
      amount: 1000,
      price: 298.50,
      value: 1000.00,
      timestamp: Date.now() - 345600000,
      txHash: '0x5432...8765',
      status: 'completed'
    }
  ]

  const mockPerformanceData = {
    chartData: [
      { date: '2024-01-01', value: 12000 },
      { date: '2024-01-15', value: 12500 },
      { date: '2024-02-01', value: 11800 },
      { date: '2024-02-15', value: 13200 },
      { date: '2024-03-01', value: 14100 },
      { date: '2024-03-15', value: 15847 }
    ],
    metrics: {
      totalReturn: 2847.92,
      totalReturnPercentage: 21.87,
      bestPerformingAsset: 'ETH',
      worstPerformingAsset: 'BTC',
      sharpeRatio: 1.23,
      volatility: 0.45,
      maxDrawdown: -8.9
    }
  }

  useEffect(() => {
    loadPortfolioData()
  }, [account])

  const loadPortfolioData = async () => {
    if (!account) return

    setLoading(true)
    
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setPortfolio(mockPortfolioData)
      setTransactions(mockTransactions)
      setPerformance(mockPerformanceData)
      
    } catch (error) {
      console.error('Error loading portfolio data:', error)
      toast.error('Failed to load portfolio data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercentage = (percentage) => {
    const isPositive = percentage >= 0
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↗' : '↘'}
        {Math.abs(percentage).toFixed(2)}%
      </span>
    )
  }

  const getTransactionIcon = (type) => {
    const icons = {
      buy: '📈',
      sell: '📉',
      stake: '🔒',
      swap: '🔄',
      claim: '🎁'
    }
    return icons[type] || '💰'
  }

  const getTransactionColor = (type) => {
    const colors = {
      buy: 'text-green-500',
      sell: 'text-red-500',
      stake: 'text-blue-500',
      swap: 'text-purple-500',
      claim: 'text-yellow-500'
    }
    return colors[type] || 'text-gray-500'
  }

  if (!account) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🔗</div>
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-secondary">Connect your wallet to view your portfolio</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="section-header mb-8">
          <h2 className="section-title">Portfolio</h2>
          <p className="section-subtitle">Track your crypto investments and performance</p>
        </div>

        <div className="responsive-grid-3 gap-6 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className="stat-card-enhanced">
              <div className="loading-skeleton h-6 mb-2"></div>
              <div className="loading-skeleton h-8 mb-2"></div>
              <div className="loading-skeleton h-4"></div>
            </div>
          ))}
        </div>

        <div className="feature-card">
          <div className="loading-skeleton h-8 mb-6"></div>
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="loading-skeleton h-20"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="section-header mb-8">
        <h2 className="section-title">Portfolio</h2>
        <p className="section-subtitle">Track your crypto investments and performance</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="feature-icon" style={{ width: '24px', height: '24px', backgroundColor: '#10b98120', color: '#10b981' }}>
            👤
          </div>
          <span className="text-sm font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="responsive-grid-3 gap-6 mb-8">
        <div className="stat-card-enhanced">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">Total Portfolio Value</span>
            <div className="feature-icon" style={{ width: '32px', height: '32px', backgroundColor: '#3b82f620', color: '#3b82f6' }}>
              💼
            </div>
          </div>
          <div className="stat-value-large">
            {formatCurrency(portfolio.totalValue)}
          </div>
          <div className="text-sm text-secondary">Total asset value</div>
        </div>

        <div className="stat-card-enhanced">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">Total P&L</span>
            <div className="feature-icon" style={{ width: '32px', height: '32px', backgroundColor: portfolio.totalPnl >= 0 ? '#10b98120' : '#ef444420', color: portfolio.totalPnl >= 0 ? '#10b981' : '#ef4444' }}>
              {portfolio.totalPnl >= 0 ? '📈' : '📉'}
            </div>
          </div>
          <div className="stat-value-large">
            {formatCurrency(portfolio.totalPnl)}
          </div>
          {formatPercentage(portfolio.totalPnlPercentage)}
        </div>

        <div className="stat-card-enhanced">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">Assets</span>
            <div className="feature-icon" style={{ width: '32px', height: '32px', backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
              🪙
            </div>
          </div>
          <div className="stat-value-large">
            {portfolio.assets.length}
          </div>
          <div className="text-sm text-secondary">Unique tokens</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs-enhanced mb-8">
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'assets', label: '🪙 Assets', icon: '🪙' },
          { id: 'transactions', label: '📋 Transactions', icon: '📋' },
          { id: 'analytics', label: '📈 Analytics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab-enhanced ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.label.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Asset Allocation Chart */}
          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-6">Asset Allocation</h3>
            <div className="responsive-grid-2 gap-8">
              <div className="space-y-4">
                {portfolio.assets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{asset.icon}</span>
                      <div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-sm text-secondary">{asset.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{asset.allocation.toFixed(1)}%</div>
                      <div className="text-sm text-secondary">{formatCurrency(asset.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Simple pie chart representation */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray={`${portfolio.assets[0]?.allocation || 0} ${100 - (portfolio.assets[0]?.allocation || 0)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{portfolio.assets.length}</div>
                      <div className="text-xs text-secondary">Assets</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="responsive-grid-2 gap-6">
            <div className="feature-card">
              <h4 className="font-semibold mb-4">🏆 Best Performer</h4>
              {portfolio.assets.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{portfolio.assets[0].icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{portfolio.assets[0].name}</div>
                    <div className="text-sm text-secondary">{portfolio.assets[0].balance.toFixed(4)} {portfolio.assets[0].symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(portfolio.assets[0].value)}</div>
                    {formatPercentage(portfolio.assets[0].pnlPercentage)}
                  </div>
                </div>
              )}
            </div>

            <div className="feature-card">
              <h4 className="font-semibold mb-4">📊 Portfolio Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Sharpe Ratio</span>
                  <span className="font-semibold">1.23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Volatility</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Max Drawdown</span>
                  <span className="font-semibold text-red-500">-8.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="feature-card">
          <h3 className="text-xl font-semibold mb-6">Your Assets</h3>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Asset</th>
                  <th className="text-right py-3 px-4">Balance</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Value</th>
                  <th className="text-right py-3 px-4">P&L</th>
                  <th className="text-right py-3 px-4">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.assets.map(asset => (
                  <tr key={asset.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{asset.icon}</span>
                        <div>
                          <div className="font-semibold">{asset.name}</div>
                          <div className="text-sm text-secondary">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {asset.balance.toFixed(4)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {formatCurrency(asset.currentPrice)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-semibold">
                      {formatCurrency(asset.value)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-mono">{formatCurrency(asset.pnl)}</div>
                      {formatPercentage(asset.pnlPercentage)}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold">
                      {asset.allocation.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {portfolio.assets.map(asset => (
              <div key={asset.id} className="stat-card-enhanced">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{asset.icon}</span>
                    <div>
                      <div className="font-semibold">{asset.name}</div>
                      <div className="text-sm text-secondary">{asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold">{formatCurrency(asset.value)}</div>
                    {formatPercentage(asset.pnlPercentage)}
                  </div>
                </div>
                
                <div className="responsive-grid-2 gap-3 text-sm">
                  <div>
                    <span className="stat-label-enhanced">Balance</span>
                    <div className="font-mono">{asset.balance.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="stat-label-enhanced">Allocation</span>
                    <div className="font-semibold">{asset.allocation.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="feature-card">
          <h3 className="text-xl font-semibold mb-6">Transaction History</h3>
          
          <div className="space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className="stat-card-enhanced">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`feature-icon ${getTransactionColor(tx.type)}`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">{tx.type}</div>
                      <div className="text-sm text-secondary">
                        {tx.amount} {tx.asset}
                      </div>
                      <div className="text-xs text-secondary font-mono">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-mono font-semibold">
                      {formatCurrency(tx.value)}
                    </div>
                    <div className="text-sm text-secondary">
                      @ {formatCurrency(tx.price)}
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View TX ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <div className="text-lg mb-2">No transactions yet</div>
              <div className="text-secondary">Your transaction history will appear here</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Performance Chart */}
          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-6">Portfolio Performance</h3>
            <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-lg font-semibold mb-2">Portfolio Growth</div>
                <div className="text-sm text-secondary">Interactive chart would be displayed here</div>
                <div className="mt-4 text-2xl font-bold text-green-500">
                  +{formatPercentage(portfolio.totalPnlPercentage).props.children[1]}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="responsive-grid-2 gap-6">
            <div className="feature-card">
              <h4 className="font-semibold mb-4">📊 Performance Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Total Return</span>
                  <span className="font-semibold text-green-500">+21.87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Best Asset</span>
                  <span className="font-semibold">ETH (+7.54%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Risk Score</span>
                  <span className="font-semibold text-yellow-500">Medium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Diversification</span>
                  <span className="font-semibold text-blue-500">Good</span>
                </div>
              </div>
            </div>

            <div className="feature-card">
              <h4 className="font-semibold mb-4">💡 Insights</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Portfolio Rebalancing
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Consider rebalancing your ETH allocation
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">
                    Strong Performance
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Your portfolio outperformed the market by 8.2%
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Risk Management
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Consider adding stablecoin exposure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioManager