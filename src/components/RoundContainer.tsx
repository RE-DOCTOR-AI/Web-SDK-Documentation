import { ReactNode } from 'react'

export const RoundedContainer = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={'rounded-lg border-1 border-gray-300 dark:border-gray-500 ' + className}>{children}</div>
}
