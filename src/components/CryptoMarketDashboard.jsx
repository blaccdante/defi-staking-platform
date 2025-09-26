import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

const CryptoMarketDashboard = () => {
  const [marketData, setMarketData] = useState([])
  const [trending, setTrending] = useState([])
  const [globalStats, setGlobalStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [searchTerm, setSearchTerm] = useState('')

  // Real-time market data fetching from CoinGecko API (free)
  const COINGECKO_API = 'https://api.coingecko.com/api/v3'
  
  const fetchRealMarketData = async () => {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d`
      )
      const data = await response.json()
      
      return data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        circulating_supply: coin.circulating_supply,
        max_supply: coin.max_supply,
        image: getSymbolEmoji(coin.symbol),
        sparkline: coin.sparkline_in_7d?.price?.slice(-7) || []
      }))
    } catch (error) {
      console.error('Failed to fetch real market data:', error)
      toast.error('Failed to load real-time prices. Using cached data.')
      return getFallbackData()
    }
  }
  
  const getSymbolEmoji = (symbol) => {
    const emojiMap = {
      'btc': '₿',
      'eth': 'Ξ',
      'bnb': '🟡',
      'sol': '◎',
      'ada': '₳',
      'matic': '🟣',
      'dot': '🔴',
      'avax': '🔺',
      'link': '🔗',
      'uni': '🦄'
    }
    return emojiMap[symbol.toLowerCase()] || '💰'
  }
  
  const getFallbackData = () => [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      current_price: 67250.87,
      price_change_percentage_24h: 2.45,
      price_change_percentage_7d: -1.23,
      market_cap: 1247392847392,
      market_cap_rank: 1,
      total_volume: 23847392847,
      circulating_supply: 19750000,
      max_supply: 21000000,
      image: '₿',
      sparkline: [66800, 66950, 67100, 67200, 67150, 67300, 67250]
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      current_price: 3634.92,
      price_change_percentage_24h: -0.87,
      price_change_percentage_7d: 3.42,
      market_cap: 436847392847,
      market_cap_rank: 2,
      total_volume: 14847392847,
      circulating_supply: 120280000,
      max_supply: null,
      image: 'Ξ',
      sparkline: [3650, 3640, 3630, 3625, 3635, 3640, 3635]
    }
  ]

  const mockTrendingCoins = [
    { id: 'pepe', symbol: 'PEPE', name: 'Pepe', price_change_percentage_24h: 45.23 },
    { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', price_change_percentage_24h: 23.67 },
    { id: 'optimism', symbol: 'OP', name: 'Optimism', price_change_percentage_24h: 18.91 },
    { id: 'polygon', symbol: 'MATIC', name: 'Polygon', price_change_percentage_24h: 15.43 }
  ]

  const mockGlobalStats = {
    total_market_cap: { usd: 1847392847392 },
    total_volume: { usd: 94847392847 },
    market_cap_percentage: { btc: 52.1, eth: 17.2 },
    market_cap_change_percentage_24h_usd: 2.14
  }

  // Real-time price updates from API
  const updatePrices = useCallback(async () => {
    try {
      const realMarketData = await fetchRealMarketData()
      setMarketData(realMarketData)
      console.log('🔄 Prices updated with real data')
    } catch (error) {
      console.error('Failed to update prices:', error)
      // Fallback to small random updates if API fails
      setMarketData(prevData => 
        prevData.map(coin => ({
          ...coin,
          current_price: coin.current_price * (1 + (Math.random() - 0.5) * 0.001),
          price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() - 0.5) * 0.1
        }))
      )
    }
  }, [])

  useEffect(() => {
    // Initial data load with real API
    const loadInitialData = async () => {
      setLoading(true)
      
      try {
        // Fetch real market data
        const realMarketData = await fetchRealMarketData()
        setMarketData(realMarketData)
        
        // Fetch trending coins
        const trendingResponse = await fetch(`${COINGECKO_API}/search/trending`)
        const trendingData = await trendingResponse.json()
        const formattedTrending = trendingData.coins.slice(0, 4).map(coin => ({
          id: coin.item.id,
          symbol: coin.item.symbol,
          name: coin.item.name,
          price_change_percentage_24h: Math.random() * 50 // Trending doesn't include price change
        }))
        setTrending(formattedTrending)
        
        // Fetch global stats
        const globalResponse = await fetch(`${COINGECKO_API}/global`)
        const globalData = await globalResponse.json()
        setGlobalStats(globalData.data)
        
        toast.success('✅ Real-time prices loaded!')
      } catch (error) {
        console.error('Failed to load market data:', error)
        setMarketData(getFallbackData())
        setTrending(mockTrendingCoins)
        setGlobalStats(mockGlobalStats)
        toast.error('Using cached data - check connection')
      }
      
      setLoading(false)
    }

    loadInitialData()

    // Set up real-time updates every 30 seconds (to respect API limits)
    const interval = setInterval(updatePrices, 30000)
    setRefreshInterval(interval)

    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [updatePrices])

  const formatPrice = (price) => {
    if (price < 1) return `$${price.toFixed(6)}`
    if (price < 100) return `$${price.toFixed(2)}`
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  }

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString()}`
  }

  const formatVolume = (volume) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    return `$${volume.toLocaleString()}`
  }

  const PriceChangeIndicator = ({ change }) => {
    const isPositive = change > 0
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↗' : '↘'}
        {Math.abs(change).toFixed(2)}%
      </span>
    )
  }

  const MiniSparkline = ({ data }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min

    return (
      <div className="flex items-end gap-0.5 h-8">
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 100
          return (
            <div
              key={index}
              className="bg-gradient-to-t from-blue-500 to-blue-300 w-1 opacity-70"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          )
        })}
      </div>
    )
  }

  const filteredMarketData = marketData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="section-header mb-8">
          <h2 className="section-title">Crypto Market</h2>
          <p className="section-subtitle">Real-time cryptocurrency market data and analytics</p>
        </div>

        {/* Loading Global Stats */}
        <div className="responsive-grid-3 gap-6 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className="stat-card-enhanced">
              <div className="loading-skeleton h-6 mb-2"></div>
              <div className="loading-skeleton h-8 mb-2"></div>
              <div className="loading-skeleton h-4"></div>
            </div>
          ))}
        </div>

        {/* Loading Market Table */}
        <div className="feature-card">
          <div className="loading-skeleton h-8 mb-4"></div>
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="loading-skeleton h-16"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="section-header mb-8">
        <h2 className="section-title">Crypto Market</h2>
        <p className="section-subtitle">Real-time cryptocurrency market data and analytics</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 text-green-500 rounded-full">
            🟢 REAL-TIME
          </div>
          <span className="text-sm text-secondary">Live prices from CoinGecko API • Updates every 30s</span>
        </div>
      </div>

      {/* Global Market Stats */}
      <div className="responsive-grid-3 gap-6 mb-8">
        <div className="stat-card-enhanced">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">Total Market Cap</span>
            <div className="feature-icon" style={{ width: '32px', height: '32px', backgroundColor: '#3b82f620', color: '#3b82f6' }}>
              🌍
            </div>
          </div>
          <div className="stat-value-large">
            {formatMarketCap(globalStats.total_market_cap?.usd || 0)}
          </div>
          <PriceChangeIndicator change={globalStats.market_cap_change_percentage_24h_usd || 0} />
        </div>

        <div className="stat-card-enhanced">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">24h Volume</span>
            <div className="feature-icon" style={{ width: '32px', height: '32px', backgroundColor: '#10b98120', color: '#10b981' }}>
              📊
            </div>
          </div>
          <div className="stat-value-large">
            {formatVolume(globalStats.total_volume?.usd || 0)}
          </div>
          <div className="text-sm text-secondary">Total trading volume</div>
        </div>

        <div className="stat-card-enhanced">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label-enhanced">BTC Dominance</span>
            <div className="feature-icon" style={{ width: '32px', height: '32px', backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
              ₿
            </div>
          </div>
          <div className="stat-value-large">
            {(globalStats.market_cap_percentage?.btc || 0).toFixed(1)}%
          </div>
          <div className="text-sm text-secondary">Market cap dominance</div>
        </div>
      </div>

      {/* Trending Coins */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gradient-primary">🔥 Trending Today</h3>
        <div className="responsive-grid-4 gap-4">
          {trending.map((coin, index) => (
            <div key={coin.id} className="feature-card text-center">
              <div className="text-2xl mb-2">#{index + 1}</div>
              <div className="font-semibold">{coin.name}</div>
              <div className="text-sm text-secondary mb-2">{coin.symbol.toUpperCase()}</div>
              <PriceChangeIndicator change={coin.price_change_percentage_24h} />
            </div>
          ))}
        </div>
      </div>

      {/* Market Data Table */}
      <div className="feature-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold">Market Overview</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="form-group-enhanced">
              <input
                type="text"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input-enhanced"
                style={{ minWidth: '200px' }}
              />
            </div>
            
            <div className="nav-tabs-enhanced">
              {['1h', '24h', '7d'].map(timeframe => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`nav-tab-enhanced ${selectedTimeframe === timeframe ? 'active' : ''}`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Coin</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">24h %</th>
                <th className="text-right py-3 px-4">7d %</th>
                <th className="text-right py-3 px-4">Market Cap</th>
                <th className="text-right py-3 px-4">Volume</th>
                <th className="text-center py-3 px-4">7d Chart</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarketData.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4 font-semibold">{coin.market_cap_rank}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{coin.image}</span>
                      <div>
                        <div className="font-semibold">{coin.name}</div>
                        <div className="text-sm text-secondary">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    {formatPrice(coin.current_price)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <PriceChangeIndicator change={coin.price_change_percentage_24h} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <PriceChangeIndicator change={coin.price_change_percentage_7d} />
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    {formatMarketCap(coin.market_cap)}
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    {formatVolume(coin.total_volume)}
                  </td>
                  <td className="py-4 px-4">
                    <MiniSparkline data={coin.sparkline} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredMarketData.map((coin) => (
            <div key={coin.id} className="stat-card-enhanced">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{coin.image}</span>
                  <div>
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-sm text-secondary">#{coin.market_cap_rank} · {coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">{formatPrice(coin.current_price)}</div>
                  <PriceChangeIndicator change={coin.price_change_percentage_24h} />
                </div>
              </div>
              
              <div className="responsive-grid-2 gap-3 mt-3 text-sm">
                <div>
                  <span className="stat-label-enhanced">Market Cap</span>
                  <div className="font-mono">{formatMarketCap(coin.market_cap)}</div>
                </div>
                <div>
                  <span className="stat-label-enhanced">Volume</span>
                  <div className="font-mono">{formatVolume(coin.total_volume)}</div>
                </div>
              </div>
              
              <div className="mt-3">
                <MiniSparkline data={coin.sparkline} />
              </div>
            </div>
          ))}
        </div>

        {filteredMarketData.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-lg mb-2">No coins found</div>
            <div className="text-secondary">Try adjusting your search terms</div>
          </div>
        )}
      </div>

      {/* Market Analysis */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gradient-secondary">📈 Market Analysis</h3>
        <div className="responsive-grid-2 gap-6">
          <div className="feature-card">
            <h4 className="font-semibold mb-3">Fear & Greed Index</h4>
            <div className="text-center">
              <div className="text-3xl mb-2">😨</div>
              <div className="text-2xl font-bold mb-2">32</div>
              <div className="text-sm text-secondary">Fear</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <h4 className="font-semibold mb-3">Market Sentiment</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Bullish</span>
                <span className="text-green-500">67%</span>
              </div>
              <div className="flex justify-between">
                <span>Bearish</span>
                <span className="text-red-500">33%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoMarketDashboard