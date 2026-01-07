import { createContext } from 'react'
import { Key, TreeNodeType } from './type'

interface TreeContextProps {
  expandedKeys: Key[]
  selectedKeys: Key[]
  onExpand: (key: Key, node: TreeNodeType) => void
  onSelect: (key: Key, node: TreeNodeType) => void
}

export const TreeContext = createContext<TreeContextProps | null>(null)
