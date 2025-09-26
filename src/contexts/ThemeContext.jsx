import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or default to futuristic
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'futuristic'].includes(savedTheme)) {
      return savedTheme
    }
    // For new users, default to futuristic theme for the DeFi experience
    return 'futuristic' // Default to futuristic theme
  })

  // Update theme in localStorage and document
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Listen for system theme changes (disabled to maintain futuristic default)
  useEffect(() => {
    // System theme changes disabled to prioritize futuristic theme experience
    // Users can still manually change themes using the theme toggle
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case 'futuristic':
          return 'dark'
        case 'dark':
          return 'light'
        case 'light':
          return 'futuristic'
        default:
          return 'futuristic'
      }
    })
  }

  const setLightTheme = () => setTheme('light')
  const setDarkTheme = () => setTheme('dark')
  const setFuturisticTheme = () => setTheme('futuristic')

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setFuturisticTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
    isFuturistic: theme === 'futuristic'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext