import { ReactNode } from 'react'

export const ContainerBody = ({ children }: { children: ReactNode }) => {
  return <div className="p-4">{children}</div>
}
