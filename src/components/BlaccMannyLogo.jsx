import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const BlaccMannyLogo = ({ size = 'large' }) => {
  const { theme } = useTheme()
  
  const sizes = {
    small: { width: 32, height: 32, fontSize: '1.1rem' },
    medium: { width: 60, height: 60, fontSize: '1.5rem' },
    large: { width: 80, height: 80, fontSize: '2rem' }
  }
  
  const logoSize = sizes[size] || sizes.large
  
  return (
    <div className="blaccmanny-logo" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      {/* Animated Logo SVG */}
      <div className="logo-container" style={{ position: 'relative' }}>
        <svg 
          width={logoSize.width} 
          height={logoSize.height} 
          viewBox="0 0 100 100" 
          className="logo-svg"
        >
          {/* Outer ring with rotation animation */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="20 10"
            className="logo-outer-ring"
          />
          
          {/* Inner hexagon */}
          <polygon
            points="50,15 75,30 75,60 50,75 25,60 25,30"
            fill="url(#logoFillGradient)"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            className="logo-hexagon"
          />
          
          {/* Center diamond */}
          <polygon
            points="50,25 65,40 50,55 35,40"
            fill={theme === 'dark' ? '#ffffff' : '#000000'}
            className="logo-diamond"
          />
          
          {/* Center dot */}
          <circle
            cx="50"
            cy="40"
            r="3"
            fill={theme === 'dark' ? '#000000' : '#000000'}
            className="logo-center-dot"
          />
          
          {/* Letter "B" stylized */}
          <path
            d="M45 60 L45 75 L55 75 L60 70 L60 67.5 L55 65 L60 62.5 L60 60 L45 60 M48 63 L55 63 M48 67.5 L55 67.5 M48 72 L55 72"
            stroke={theme === 'dark' ? '#ffffff' : '#000000'}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-letter"
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme === 'dark' ? '#22c55e' : '#0ea5e9'} />
              <stop offset="50%" stopColor={theme === 'dark' ? '#059669' : '#0284c7'} />
              <stop offset="100%" stopColor={theme === 'dark' ? '#047857' : '#0369a1'} />
            </linearGradient>
            <radialGradient id="logoFillGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(14, 165, 233, 0.08)'} />
              <stop offset="100%" stopColor={theme === 'dark' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(3, 105, 161, 0.15)'} />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Floating particles animation */}
        <div className="logo-particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                position: 'absolute',
                width: '3px',
                height: '3px',
                background: 'var(--brand-accent)',
                borderRadius: '50%',
                animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                top: `${20 + i * 10}%`,
                left: `${15 + i * 12}%`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Logo Text */}
      {(size === 'large' || size === 'small') && (
        <div className="logo-text">
          <div 
            className="logo-title"
            style={{
              fontSize: logoSize.fontSize,
              fontWeight: '800',
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #0ea5e9 100%)'
                : 'linear-gradient(135deg, #000000 0%, #1f2937 30%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              animation: size === 'large' ? 'titleSlide 1.2s ease-out' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            BlaccManny
          </div>
          {size === 'large' && (
            <div 
              className="logo-subtitle"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)',
                fontWeight: '500',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 'var(--space-1)',
                animation: 'subtitleFade 1.5s ease-out 0.3s both',
              }}
            >
              DeFi Staking Platform
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BlaccMannyLogo