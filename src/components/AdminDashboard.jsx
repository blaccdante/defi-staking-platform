import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { walletAnalytics } from '../services/WalletAnalytics'

const AdminDashboard = ({ currentUser, onClose }) => {
  console.log('🔧 AdminDashboard component loaded', { currentUser, onClose })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState([])
  const [connectedWallets, setConnectedWallets] = useState([])
  const [realTimeStats, setRealTimeStats] = useState({})
  const [searchAddress, setSearchAddress] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  // Admin access control (you can customize this)
  // For now, allow any connected wallet to access admin dashboard
  const isAdmin = currentUser && currentUser.isAuthenticated

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData()
      
      // Set up real-time updates every 30 seconds
      const interval = setInterval(() => {
        loadRealTimeStats()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [isAdmin])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      console.log('📊 Loading dashboard data...')
      const [analyticsData, walletsData, statsData] = await Promise.all([
        walletAnalytics.getAnalytics(30),
        walletAnalytics.getConnectedWallets(100),
        walletAnalytics.getRealTimeStats()
      ])
      
      console.log('✅ Dashboard data loaded:', { analyticsData, walletsData, statsData })
      setAnalytics(analyticsData || [])
      setConnectedWallets(walletsData || [])
      setRealTimeStats(statsData || {})
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error)
      // Set default values so UI still renders
      setAnalytics([])
      setConnectedWallets([])
      setRealTimeStats({})
      toast.error('Using demo data - Dashboard service unavailable')
    } finally {
      setLoading(false)
    }
  }

  const loadRealTimeStats = async () => {
    try {
      const stats = await walletAnalytics.getRealTimeStats()
      setRealTimeStats(stats)
    } catch (error) {
      console.error('Error loading real-time stats:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchAddress.trim()) return
    
    try {
      setLoading(true)
      const result = await walletAnalytics.getWalletInfo(searchAddress)
      setSearchResult(result)
      if (!result) {
        toast.error('Wallet not found')
      }
    } catch (error) {
      console.error('Error searching wallet:', error)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleString()
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="alert alert-warning">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">🔒 Access Denied</h3>
            <p>You don't have permission to access the admin dashboard.</p>
            <div className="text-xs text-gray-500 mt-2">
              Debug: {currentUser ? 'User exists' : 'No user'} | 
              {currentUser?.isAuthenticated ? 'Authenticated' : 'Not authenticated'}
            </div>
            <button 
              onClick={onClose}
              className="btn-enhanced btn-secondary-enhanced btn-small mt-4"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Add error boundary protection
  const renderWithErrorBoundary = (content) => {
    try {
      return content
    } catch (error) {
      console.error('AdminDashboard render error:', error)
      return (
        <div className="alert alert-error">
          <h3>⚠️ Dashboard Error</h3>
          <p>There was an issue loading the admin dashboard.</p>
          <button onClick={() => window.location.reload()} className="btn-enhanced btn-secondary-enhanced btn-small mt-2">
            Reload Page
          </button>
        </div>
      )
    }
  }

  return renderWithErrorBoundary(
    <div className="max-w-7xl mx-auto">
      <div className="section-header mb-8">
        <h2 className="section-title">🔧 Admin Dashboard</h2>
        <p className="section-subtitle">
          Wallet analytics and user management
        </p>
      </div>

      {/* Navigation */}
      <div className="nav-tabs mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('wallets')}
          className={`nav-tab ${activeTab === 'wallets' ? 'active' : ''}`}
        >
          👛 Wallets
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          📈 Analytics
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
        >
          🔍 Search
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="loading-enhanced mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && !loading && (
        <div className="space-y-6">
          {/* Real-time Stats */}
          <div className="responsive-grid-4 gap-6">
            <div className="stat-card-enhanced">
              <div className="stat-value-enhanced text-neon-cyan">
                {realTimeStats.todayConnections || 0}
              </div>
              <div className="stat-label-enhanced">Today's Connections</div>
            </div>
            
            <div className="stat-card-enhanced">
              <div className="stat-value-enhanced text-neon-green">
                {connectedWallets.length}
              </div>
              <div className="stat-label-enhanced">Total Unique Wallets</div>
            </div>
            
            <div className="stat-card-enhanced">
              <div className="stat-value-enhanced text-neon-purple">
                {Object.keys(realTimeStats.walletTypes || {}).length}
              </div>
              <div className="stat-label-enhanced">Wallet Types</div>
            </div>
            
            <div className="stat-card-enhanced">
              <div className="stat-value-enhanced text-neon-orange">
                {Object.keys(realTimeStats.chains || {}).length}
              </div>
              <div className="stat-label-enhanced">Networks</div>
            </div>
          </div>

          {/* Wallet Types Breakdown */}
          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-4">Wallet Types Distribution</h3>
            <div className="space-y-3">
              {Object.entries(realTimeStats.walletTypes || {}).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type}</span>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden"
                    >
                      <div 
                        className="h-full bg-neon-cyan rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(realTimeStats.walletTypes || {}))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-mono">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Connections */}
          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-4">Recent Connections</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2">Wallet</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Last Seen</th>
                    <th className="text-left py-2">Connections</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedWallets.slice(0, 10).map((wallet) => (
                    <tr key={wallet.address} className="border-b border-gray-700">
                      <td className="py-2 font-mono text-neon-cyan">
                        {formatAddress(wallet.address)}
                      </td>
                      <td className="py-2 capitalize">{wallet.walletType}</td>
                      <td className="py-2">{formatDate(wallet.lastConnectionTime)}</td>
                      <td className="py-2">{wallet.totalConnections}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Wallets Tab */}
      {activeTab === 'wallets' && !loading && (
        <div className="space-y-6">
          <div className="feature-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Connected Wallets ({connectedWallets.length})</h3>
              <button 
                onClick={loadDashboardData}
                className="btn-enhanced btn-secondary-enhanced btn-small"
              >
                🔄 Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3">Wallet Address</th>
                    <th className="text-left py-3">Type</th>
                    <th className="text-left py-3">Chain</th>
                    <th className="text-left py-3">First Seen</th>
                    <th className="text-left py-3">Last Seen</th>
                    <th className="text-left py-3">Connections</th>
                    <th className="text-left py-3">Platform</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedWallets.map((wallet) => (
                    <tr key={wallet.address} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 font-mono text-neon-cyan">
                        {formatAddress(wallet.address)}
                        <button 
                          onClick={() => navigator.clipboard.writeText(wallet.address)}
                          className="ml-2 text-xs text-gray-400 hover:text-neon-cyan"
                        >
                          📋
                        </button>
                      </td>
                      <td className="py-3 capitalize">{wallet.walletType}</td>
                      <td className="py-3">{wallet.chainId}</td>
                      <td className="py-3">{formatDate(wallet.firstConnectionTime)}</td>
                      <td className="py-3">{formatDate(wallet.lastConnectionTime)}</td>
                      <td className="py-3 font-semibold">{wallet.totalConnections}</td>
                      <td className="py-3">{wallet.lastPlatform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && !loading && (
        <div className="space-y-6">
          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-4">Daily Connection Analytics (Last 30 Days)</h3>
            <div className="space-y-4">
              {analytics.map((day) => (
                <div key={day.id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                  <div>
                    <div className="font-semibold">{day.date}</div>
                    <div className="text-sm text-gray-400">
                      {Object.entries(day.walletTypes || {}).map(([type, count]) => 
                        `${type}: ${count}`
                      ).join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-neon-cyan">
                      {day.totalConnections} connections
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="feature-card">
            <h3 className="text-xl font-semibold mb-4">🔍 Search Wallet</h3>
            
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Enter wallet address (0x...)"
                className="form-input-enhanced flex-1"
              />
              <button 
                onClick={handleSearch}
                disabled={!searchAddress.trim()}
                className="btn-enhanced btn-primary-enhanced btn-medium"
              >
                🔍 Search
              </button>
            </div>

            {searchResult && (
              <div className="alert alert-info">
                <h4 className="font-semibold mb-2">Wallet Found:</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Address:</strong> {searchResult.address}</div>
                  <div><strong>Type:</strong> {searchResult.walletType}</div>
                  <div><strong>Chain:</strong> {searchResult.chainId}</div>
                  <div><strong>Total Connections:</strong> {searchResult.totalConnections}</div>
                  <div><strong>First Connection:</strong> {formatDate(searchResult.firstConnection?.toDate())}</div>
                  <div><strong>Last Connection:</strong> {formatDate(searchResult.lastConnection?.toDate())}</div>
                  <div><strong>Platform:</strong> {searchResult.lastPlatform}</div>
                  <div><strong>Country:</strong> {searchResult.lastCountry}</div>
                </div>
              </div>
            )}

            {searchResult === null && searchAddress && (
              <div className="alert alert-warning">
                <p>No data found for this wallet address.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button 
          onClick={onClose}
          className="btn-enhanced btn-secondary-enhanced btn-medium"
        >
          ← Back to Platform
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
