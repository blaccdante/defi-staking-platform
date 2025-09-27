import React, { useState, useEffect } from 'react'

const MobileNavigation = ({ activeTab, setActiveTab, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navigationItems = [
    { id: 'market', label: 'Market', icon: '📈', color: '#10b981' },
    { id: 'portfolio', label: 'Portfolio', icon: '📊', color: '#3b82f6' },
    { id: 'stake', label: 'Stake', icon: '⚡', color: '#f59e0b' },
    { id: 'pools', label: 'Pools', icon: '🏊', color: '#8b5cf6' },
    { id: 'analytics', label: 'Analytics', icon: '📊', color: '#06b6d4' },
    { id: 'security', label: 'Security', icon: '🔒', color: '#ef4444' },
    { id: 'admin', label: 'Admin', icon: '⚙️', color: '#6b7280' }
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setIsMenuOpen(false) // Close mobile menu after selection
  }

  if (!isMobile) {
    // Desktop navigation - horizontal tabs
    return (
      <div className="nav-tabs desktop-nav">
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
            style={{
              '--tab-color': item.color
            }}
          >
            <span className="nav-tab-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    )
  }

  // Mobile navigation
  return (
    <div className="mobile-nav-container">
      {/* Mobile Tab Bar - Bottom Navigation */}
      <div className="mobile-tab-bar">
        {navigationItems.slice(0, 4).map(item => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`mobile-tab ${activeTab === item.id ? 'active' : ''}`}
            style={{
              '--tab-color': item.color,
              '--tab-bg': activeTab === item.id ? `${item.color}20` : 'transparent'
            }}
          >
            <span className="mobile-tab-icon">{item.icon}</span>
            <span className="mobile-tab-label">{item.label}</span>
          </button>
        ))}
        
        {/* More button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`mobile-tab more-tab ${isMenuOpen ? 'active' : ''}`}
        >
          <span className="mobile-tab-icon">
            {isMenuOpen ? '✕' : '⋯'}
          </span>
          <span className="mobile-tab-label">More</span>
        </button>
      </div>

      {/* Expandable Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <h3>More Options</h3>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="mobile-menu-close"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-menu-items">
              {navigationItems.slice(4).map(item => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`mobile-menu-item ${activeTab === item.id ? 'active' : ''}`}
                  style={{
                    '--item-color': item.color
                  }}
                >
                  <span className="mobile-menu-icon">{item.icon}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                  {activeTab === item.id && <span className="mobile-menu-active">✓</span>}
                </button>
              ))}
              
              {user?.walletOnly && (
                <button
                  onClick={() => handleTabChange('account')}
                  className={`mobile-menu-item ${activeTab === 'account' ? 'active' : ''} upgrade-item`}
                >
                  <span className="mobile-menu-icon">✨</span>
                  <span className="mobile-menu-label">Create Account</span>
                  {activeTab === 'account' && <span className="mobile-menu-active">✓</span>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .mobile-nav-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .mobile-tab-bar {
          display: flex;
          background: var(--glass-bg);
          border-top: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          padding: env(safe-area-inset-bottom) var(--space-2) var(--space-2);
          height: calc(60px + env(safe-area-inset-bottom));
        }

        .mobile-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-2);
          background: var(--tab-bg);
          border: none;
          border-radius: var(--radius-md);
          margin: 0 var(--space-1);
          transition: all 0.2s ease;
          min-height: 44px;
          color: var(--text-secondary);
        }

        .mobile-tab.active {
          color: var(--tab-color);
          background: var(--tab-bg);
          transform: translateY(-2px);
        }

        .mobile-tab-icon {
          font-size: 1.2rem;
          margin-bottom: 2px;
        }

        .mobile-tab-label {
          font-size: 0.6rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .more-tab {
          background: var(--glass-bg) !important;
          border: 1px solid var(--glass-border);
        }

        .more-tab.active {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #6366f1;
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 60px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          animation: fadeIn 0.2s ease;
        }

        .mobile-menu {
          width: 100%;
          background: var(--glass-bg);
          border-top-left-radius: var(--radius-xl);
          border-top-right-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          max-height: 50vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) var(--space-4) var(--space-2);
          border-bottom: 1px solid var(--glass-border);
        }

        .mobile-menu-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .mobile-menu-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: var(--text-secondary);
          padding: var(--space-2);
          border-radius: var(--radius-md);
          min-height: 36px;
          min-width: 36px;
        }

        .mobile-menu-items {
          padding: var(--space-2);
        }

        .mobile-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: var(--space-3);
          background: none;
          border: none;
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-2);
          transition: all 0.2s ease;
          min-height: 52px;
          text-align: left;
          color: var(--text-primary);
        }

        .mobile-menu-item:hover,
        .mobile-menu-item:focus {
          background: var(--glass-bg);
          transform: translateX(4px);
        }

        .mobile-menu-item.active {
          background: rgba(var(--item-color), 0.1);
          color: var(--item-color);
        }

        .mobile-menu-item.upgrade-item {
          background: linear-gradient(45deg, #f59e0b20, #10b98120);
          border: 1px solid #f59e0b40;
        }

        .mobile-menu-icon {
          font-size: 1.3rem;
          margin-right: var(--space-3);
          width: 24px;
          text-align: center;
        }

        .mobile-menu-label {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .mobile-menu-active {
          color: var(--item-color);
          font-weight: bold;
        }

        .desktop-nav {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
          padding: 0 var(--space-4);
        }

        .desktop-nav .nav-tab {
          flex: 0 1 auto;
          min-width: 120px;
          padding: var(--space-3) var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          transition: all 0.2s ease;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .desktop-nav .nav-tab:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: var(--glass-bg-hover);
        }

        .desktop-nav .nav-tab.active {
          color: var(--tab-color);
          background: rgba(var(--tab-color), 0.1);
          border-color: var(--tab-color);
          transform: translateY(-2px);
        }

        .desktop-nav .nav-tab-icon {
          font-size: 1.1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            transform: translateY(100%); 
            opacity: 0;
          }
          to { 
            transform: translateY(0); 
            opacity: 1;
          }
        }

        @media (max-width: 480px) {
          .mobile-tab-label {
            font-size: 0.55rem;
          }

          .mobile-tab-icon {
            font-size: 1.1rem;
          }

          .mobile-menu {
            max-height: 60vh;
          }
        }
      `}</style>
    </div>
  )
}

export default MobileNavigation