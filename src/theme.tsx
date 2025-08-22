import { useEffect, useState } from 'react'

export type ThemeType = 'light' | 'dark'

export const useTheme = () => {
  const getInitialTheme = (): ThemeType => {
    const storedTheme = localStorage.getItem('theme') as ThemeType | null
    if (storedTheme) {
      return storedTheme
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme())

  useEffect(() => {
    setTheme(currentTheme)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = (theme: ThemeType) => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem('theme') as ThemeType
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return {
    currentTheme,
    toggleTheme,
  }
}
