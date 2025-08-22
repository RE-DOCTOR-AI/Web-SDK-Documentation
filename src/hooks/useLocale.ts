import { useMemo } from 'react'

export const useLocale = (preferredLocale?: string) => {
  return useMemo(() => {
    const userLocale = preferredLocale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
    console.log('userLocale:', userLocale)
    return userLocale
  }, [preferredLocale])
}
