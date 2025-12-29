import { createContext } from 'react'
import { AccordionKey } from './type'

interface AccordionContextProps {
  activeKeys: AccordionKey[]
  toggleItem: (key: AccordionKey) => void
}

export const AccordionContext = createContext<AccordionContextProps | null>(null)
