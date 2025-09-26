import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const AnimatedBackground = () => {
  const { isFuturistic } = useTheme()
  
  // Don't render when futuristic theme is active
  if (isFuturistic) return null
  
  return (
    <div className="animated-background">
      {/* Geometric Grid Overlay */}
      <div className="grid-overlay" />
      
      {/* Neural Network Nodes */}
      <div className="neural-network">
        {[...Array(15)].map((_, i) => (
          <div
            key={`node-${i}`}
            className="neural-node"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
        
        {/* Neural Connections */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`connection-${i}`}
            className="neural-connection"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 70 + 15}%`,
              width: `${100 + Math.random() * 200}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Data Flow Streams */}
      <div className="data-streams">
        {[...Array(6)].map((_, i) => (
          <div
            key={`stream-${i}`}
            className="data-line"
            style={{
              left: `${i * 16 + 5}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating Hexagons */}
      <div className="hex-field">
        {[...Array(12)].map((_, i) => (
          <div
            key={`hex-${i}`}
            className="floating-hex"
            style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 85}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + (i % 4)}s`,
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Gradient Orbs */}
      <div className="gradient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
    </div>
  )
}

export default AnimatedBackground