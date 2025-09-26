import React, { useState, useEffect } from 'react'

const PerformanceMonitor = ({ enabled = true }) => {
  const [metrics, setMetrics] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.name.includes('firebase') || entry.name.includes('wallet')) {
          setMetrics(prev => [...prev.slice(-9), {
            name: entry.name,
            duration: Math.round(entry.duration),
            timestamp: Date.now()
          }])
        }
      })
    })

    performanceObserver.observe({ entryTypes: ['measure'] })

    // Listen for custom performance events
    const handlePerformanceEvent = (event) => {
      setMetrics(prev => [...prev.slice(-9), {
        name: event.detail.name,
        duration: event.detail.duration,
        timestamp: Date.now(),
        type: event.detail.type || 'custom'
      }])
    }

    window.addEventListener('performance-metric', handlePerformanceEvent)

    return () => {
      performanceObserver.disconnect()
      window.removeEventListener('performance-metric', handlePerformanceEvent)
    }
  }, [enabled])

  // Function to emit custom performance metrics
  window.emitPerformanceMetric = (name, duration, type = 'custom') => {
    window.dispatchEvent(new CustomEvent('performance-metric', {
      detail: { name, duration, type }
    }))
  }

  if (!enabled) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 9999
    }}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '12px',
          cursor: 'pointer',
          marginBottom: '8px'
        }}
      >
        ⚡ Performance {isVisible ? '▼' : '▲'}
      </button>
      
      {isVisible && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '11px',
          maxWidth: '300px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px' }}>🔍 Performance Metrics</h4>
          
          {metrics.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>No metrics yet...</p>
          ) : (
            <div>
              {metrics.map((metric, index) => (
                <div key={index} style={{ 
                  marginBottom: '8px',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{metric.name}</div>
                  <div style={{ 
                    color: metric.duration > 2000 ? '#ff6b6b' : 
                           metric.duration > 1000 ? '#ffd93d' : '#6bcf7f'
                  }}>
                    {metric.duration}ms
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setMetrics([])}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                Clear Metrics
              </button>
            </div>
          )}
          
          <div style={{ marginTop: '15px', fontSize: '10px', opacity: 0.6 }}>
            <div>🟢 &lt;1s: Fast</div>
            <div>🟡 1-2s: Slow</div>
            <div>🔴 &gt;2s: Very Slow</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerformanceMonitor