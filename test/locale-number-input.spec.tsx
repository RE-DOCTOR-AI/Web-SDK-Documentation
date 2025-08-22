import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import LocaleNumberInput from '../src/components/LocaleNumberInput'
import { useLocale } from '../src/hooks/useLocale'

// Mock the useLocale hook
vi.mock('@/hooks/useLocale', () => ({
  useLocale: vi.fn(),
}))

describe('LocaleNumberInput', () => {
  beforeEach(() => {
    // Default mock implementation
    vi.mocked(useLocale).mockReturnValue('en-US')
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders with initial value', () => {
    const onChange = vi.fn()
    render(<LocaleNumberInput value={1234.56} onChange={onChange} />)
    expect(screen.getByRole('textbox')).toHaveValue('1,234.56')
  })

  it('handles null value', () => {
    const onChange = vi.fn()
    render(<LocaleNumberInput value={null} onChange={onChange} />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('formats integer value correctly', () => {
    const onChange = vi.fn()
    render(<LocaleNumberInput value={1234} onChange={onChange} numberType="int" />)
    expect(screen.getByRole('textbox')).toHaveValue('1,234')
  })

  it('handles user input and calls onChange with correct value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={null} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, '123.45')
    expect(onChange).toHaveBeenCalledWith(123.45)
    expect(input).toHaveValue('123.45')
  })

  it('handles decimal input in integer mode', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={null} onChange={onChange} numberType="int" />)
    const input = screen.getByRole('textbox')

    await user.type(input, '123.45')
    expect(onChange).toHaveBeenCalledWith(12345)
    expect(input).toHaveValue('12345')
  })

  it('formats value on blur', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={1234.56} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    await user.clear(input)
    await user.type(input, '9876.54')
    fireEvent.blur(input)

    expect(input).toHaveValue('9,876.54')
  })

  it('handles negative numbers', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={null} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, '-123.45')
    expect(onChange).toHaveBeenCalledWith(-123.45)
  })

  it('renders with different locales correctly', () => {
    vi.mocked(useLocale).mockReturnValue('de-DE')

    const onChange = vi.fn()
    render(<LocaleNumberInput value={1234.56} onChange={onChange} />)
    expect(screen.getByRole('textbox')).toHaveValue('1.234,56')
  })

  it('handles comma input in German locale', async () => {
    vi.mocked(useLocale).mockReturnValue('de-DE')

    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={null} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, '123,45')
    expect(onChange).toHaveBeenCalledWith(123.45)
  })

  it('handles dot input in German locale', async () => {
    vi.mocked(useLocale).mockReturnValue('de-DE')

    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={null} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, '123.45')
    expect(onChange).toHaveBeenCalledWith(123.45)
  })

  it('allows only one decimal separator', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={null} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, '123.45.67')
    expect(onChange).toHaveBeenCalledWith(123.4567)
  })

  it('preserves input when entering incomplete decimal', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<LocaleNumberInput value={null} onChange={onChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, '123.')
    expect(onChange).toHaveBeenCalledWith(123)
    expect(input).toHaveValue('123.')
  })

  it('updates when value prop changes externally', () => {
    const onChange = vi.fn()
    const { rerender } = render(<LocaleNumberInput value={123.45} onChange={onChange} />)

    expect(screen.getByRole('textbox')).toHaveValue('123.45')

    rerender(<LocaleNumberInput value={678.9} onChange={onChange} />)
    expect(screen.getByRole('textbox')).toHaveValue('678.9')
  })

  it('handles additional props correctly', () => {
    const onChange = vi.fn()
    render(<LocaleNumberInput value={123} onChange={onChange} placeholder="Enter a number" aria-label="Test input" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', 'Enter a number')
    expect(input).toHaveAttribute('aria-label', 'Test input')
  })
})
