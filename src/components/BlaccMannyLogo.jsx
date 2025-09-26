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
  
  // Enhanced theme-specific colors
  const getThemeColors = () => {
    switch (theme) {
      case 'futuristic':
        return {
          gradient: ['#00ffff', '#0080ff', '#8000ff'], // Neon cyan to purple
          fillGradient: ['rgba(0, 255, 255, 0.15)', 'rgba(128, 0, 255, 0.25)'],
          diamondFill: '#ffffff',
          letterStroke: '#00ffff',
          textGradient: 'linear-gradient(135deg, #00ffff 0%, #ffffff 50%, #ff00ff 100%)',
          subtitleColor: '#00ffff',
          glowColor: '#00ffff'
        }
      case 'dark':
        return {
          gradient: ['#22c55e', '#059669', '#047857'],
          fillGradient: ['rgba(34, 197, 94, 0.1)', 'rgba(5, 150, 105, 0.2)'],
          diamondFill: '#ffffff',
          letterStroke: '#ffffff',
          textGradient: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #0ea5e9 100%)',
          subtitleColor: 'var(--text-tertiary)',
          glowColor: '#22c55e'
        }
      default: // light theme
        return {
          gradient: ['#0ea5e9', '#0284c7', '#0369a1'],
          fillGradient: ['rgba(14, 165, 233, 0.08)', 'rgba(3, 105, 161, 0.15)'],
          diamondFill: '#000000',
          letterStroke: '#000000',
          textGradient: 'linear-gradient(135deg, #000000 0%, #1f2937 30%, #0ea5e9 100%)',
          subtitleColor: 'var(--text-tertiary)',
          glowColor: '#0ea5e9'
        }
    }
  }
  
  const colors = getThemeColors()
  
  return (
    <div className="blaccmanny-logo" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      {/* Animated Logo SVG */}
      <div className="logo-container" style={{ 
        position: 'relative',
        filter: theme === 'futuristic' ? `drop-shadow(0 0 10px ${colors.glowColor})` : 'none'
      }}>
        <svg 
          width={logoSize.width} 
          height={logoSize.height} 
          viewBox="0 0 100 100" 
          className="logo-svg"
          style={{ 
            filter: theme === 'futuristic' ? `drop-shadow(0 0 5px ${colors.glowColor}40)` : 'none'
          }}
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
            fill={colors.diamondFill}
            className="logo-diamond"
            style={{
              filter: theme === 'futuristic' ? `drop-shadow(0 0 3px ${colors.glowColor})` : 'none'
            }}
          />
          
          {/* Center dot */}
          <circle
            cx="50"
            cy="40"
            r="3"
            fill={theme === 'futuristic' ? colors.glowColor : '#000000'}
            className="logo-center-dot"
            style={{
              filter: theme === 'futuristic' ? `drop-shadow(0 0 2px ${colors.glowColor})` : 'none'
            }}
          />
          
          {/* Letter "B" stylized */}
          <path
            d="M45 60 L45 75 L55 75 L60 70 L60 67.5 L55 65 L60 62.5 L60 60 L45 60 M48 63 L55 63 M48 67.5 L55 67.5 M48 72 L55 72"
            stroke={colors.letterStroke}
            strokeWidth={theme === 'futuristic' ? '2.5' : '2'}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-letter"
            style={{
              filter: theme === 'futuristic' ? `drop-shadow(0 0 3px ${colors.letterStroke})` : 'none'
            }}
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.gradient[0]} />
              <stop offset="50%" stopColor={colors.gradient[1]} />
              <stop offset="100%" stopColor={colors.gradient[2]} />
            </linearGradient>
            <radialGradient id="logoFillGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.fillGradient[0]} />
              <stop offset="100%" stopColor={colors.fillGradient[1]} />
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
                width: theme === 'futuristic' ? '4px' : '3px',
                height: theme === 'futuristic' ? '4px' : '3px',
                background: theme === 'futuristic' ? colors.glowColor : 'var(--brand-accent)',
                borderRadius: '50%',
                animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                top: `${20 + i * 10}%`,
                left: `${15 + i * 12}%`,
                boxShadow: theme === 'futuristic' ? `0 0 6px ${colors.glowColor}` : 'none',
                filter: theme === 'futuristic' ? `drop-shadow(0 0 2px ${colors.glowColor})` : 'none'
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
              background: colors.textGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              animation: size === 'large' ? 'titleSlide 1.2s ease-out' : 'none',
              whiteSpace: 'nowrap',
              textShadow: theme === 'futuristic' ? `0 0 10px ${colors.glowColor}40, 0 1px 3px rgba(0,0,0,0.8)` : 'none',
              filter: theme === 'futuristic' ? `drop-shadow(0 0 8px ${colors.glowColor}60)` : 'none',
              fontFamily: theme === 'futuristic' ? 'var(--font-futuristic-display), Orbitron, monospace' : 'inherit'
            }}
          >
            BlaccManny
          </div>
          {size === 'large' && (
            <div 
              className="logo-subtitle"
              style={{
                fontSize: 'var(--text-sm)',
                color: colors.subtitleColor,
                fontWeight: theme === 'futuristic' ? '600' : '500',
                letterSpacing: theme === 'futuristic' ? '0.15em' : '0.1em',
                textTransform: 'uppercase',
                marginTop: 'var(--space-1)',
                animation: 'subtitleFade 1.5s ease-out 0.3s both',
                textShadow: theme === 'futuristic' ? `0 0 8px ${colors.subtitleColor}60, 0 1px 2px rgba(0,0,0,0.9)` : 'none',
                filter: theme === 'futuristic' ? `drop-shadow(0 0 4px ${colors.subtitleColor}40)` : 'none',
                fontFamily: theme === 'futuristic' ? 'var(--font-futuristic-body), Rajdhani, sans-serif' : 'inherit'
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