import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  divider?: boolean
}
export const ContainerHeader = ({ children, divider = false }: Props) => {
  return <h2 className={`text-xl font-semibold pl-4 pr-4 py-3 ${divider ? 'border-b-1' : ''}`}>{children}</h2>
}
