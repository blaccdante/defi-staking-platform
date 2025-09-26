import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  // Sun icon for light mode
  const SunIcon = () => (
    <svg
      className="theme-toggle-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )

  // Moon icon for dark mode
  const MoonIcon = () => (
    <svg
      className="theme-toggle-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )

  // Futuristic cyber icon for futuristic mode
  const CyberIcon = () => (
    <svg
      className="theme-toggle-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      <circle cx="12" cy="9" r="1" fill="currentColor" />
      <circle cx="16" cy="9" r="1" fill="currentColor" />
    </svg>
  )

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark'
      case 'dark':
        return 'futuristic'
      case 'futuristic':
        return 'light'
      default:
        return 'dark'
    }
  }

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon />
      case 'dark':
        return <MoonIcon />
      case 'futuristic':
        return <CyberIcon />
      default:
        return <MoonIcon />
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${getNextTheme()} mode`}
      title={`Switch to ${getNextTheme()} mode`}
    >
      {getCurrentIcon()}
    </button>
  )
}

export default ThemeToggle