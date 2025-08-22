import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { useLocale } from '@/hooks/useLocale.ts'

export type LocaleNumberInputProps = {
  value: number | null
  onChange: (value: number | null) => void
  numberType?: 'int' | 'float'
  locale?: string
  [key: string]: any // Any other input props
}

const getSeparators = (locale: string) => {
  // Format a number to determine the separators
  const parts = new Intl.NumberFormat(locale).formatToParts(1234.5)
  return {
    group: parts.find(part => part.type === 'group')?.value || ',',
    decimal: parts.find(part => part.type === 'decimal')?.value || '.',
  }
}

function parseLocaleNumber(value: string, locale: string, numberType: 'int' | 'float') {
  const { group, decimal } = getSeparators(locale)
  let normalized = value.split(group).join('')

  if (decimal !== '.') {
    normalized = normalized.split(decimal).join('.')
  }
  // Remove any non-numeric characters except minus and dot
  normalized = normalized.replace(/[^\d.-]/g, '')
  if (numberType === 'int') {
    normalized = normalized.replace(/\..*$/, '')
  }
  if (!normalized || normalized === '-' || normalized === '.') return null
  const parsed = numberType === 'int' ? parseInt(normalized, 10) : parseFloat(normalized)
  return isNaN(parsed) ? null : parsed
}

function formatLocaleNumber(value: number | null, locale: string, numberType: 'int' | 'float') {
  if (value === null || typeof value === 'undefined' || Number.isNaN(value)) return ''
  const options: Intl.NumberFormatOptions = numberType === 'int' ? { maximumFractionDigits: 0 } : {}
  return new Intl.NumberFormat(locale, options).format(value)
}

function sanitizeInput(raw: string, numType: 'int' | 'float', locale: string) {
  const { decimal } = getSeparators(locale)

  // Allow digits, minus sign, and both dot and comma as decimal separators
  const decimalRegex = numType === 'int' ? /[^\d-]/g : new RegExp(`[^\\d\\-\\.\\,]`, 'g')

  let sanitized = raw.replace(decimalRegex, '')

  if (numType === 'float') {
    // Convert both dot and comma to the locale's decimal separator
    // For display purposes only - we'll convert back to dot when updating value
    if (raw.includes('.') || raw.includes(',')) {
      // First, normalize all separators to a standard character
      let normalized = sanitized.replace(/,/g, '.')

      // Then ensure there's only one decimal point
      const parts = normalized.split('.')
      if (parts.length > 2) {
        normalized = parts[0] + '.' + parts.slice(1).join('')
      }

      // For display, use the locale's decimal separator
      sanitized = normalized.replace(/\./g, decimal)
    }
  } else if (numType === 'int') {
    // For integers, remove all decimal separators
    sanitized = sanitized.replace(/[.,]/g, '')
  }

  return sanitized
}

export const LocaleNumberInput: React.FC<LocaleNumberInputProps> = ({
  value,
  onChange,
  numberType = 'float',
  locale,
  ...rest
}) => {
  const userLocale = useLocale()
  // Track the raw input so we can preserve user intent (e.g. trailing decimal)
  const [inputValue, setInputValue] = useState(() => formatLocaleNumber(value, userLocale, numberType))
  const lastValueRef = useRef<number | null>(value)

  // Update inputValue if value prop changes from outside
  useEffect(() => {
    if (value !== lastValueRef.current) {
      setInputValue(formatLocaleNumber(value, userLocale, numberType))
      lastValueRef.current = value
    }
  }, [value, userLocale, numberType])

  // Utility: handle parsed value and update state
  function updateValue(raw: string) {
    setInputValue(raw)
    const parsed = parseLocaleNumber(raw, userLocale, numberType)
    onChange(parsed)
  }

  // Handle input change, using helpers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value, numberType, userLocale)
    updateValue(sanitized)
  }

  // On blur, format the value for display
  const handleBlur = () => {
    setInputValue(formatLocaleNumber(parseLocaleNumber(inputValue, userLocale, numberType), userLocale, numberType))
  }

  return (
    <Input
      {...rest}
      type="text"
      inputMode={numberType === 'int' ? 'numeric' : 'decimal'}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoComplete="off"
    />
  )
}

export default LocaleNumberInput
