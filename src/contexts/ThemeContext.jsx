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
  // Check for saved theme preference or default to dark
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'futuristic'].includes(savedTheme)) {
      return savedTheme
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark' // Default to dark theme
  })

  // Update theme in localStorage and document
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        // Only auto-switch if no theme is saved in localStorage
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case 'light':
          return 'dark'
        case 'dark':
          return 'futuristic'
        case 'futuristic':
          return 'light'
        default:
          return 'dark'
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