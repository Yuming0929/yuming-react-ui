import { ReactNode, CSSProperties } from 'react'

export type Key = string | number

export interface TreeNodeType {
  key: Key
  title: ReactNode
  children?: TreeNodeType[]
  disabled?: boolean
  icon?: ReactNode
  isLeaf?: boolean
  loading?: boolean
}

export interface TreeProps {
  /** 树形数据 */
  treeData: TreeNodeType[]
  /**受控：当前展开的 keys */
  expandedKeys?: Key[]
  /** 非受控：默认展开的 keys */
  defaultExpandedKeys?: Key[]
  /** 默认是否展开所有 */
  defaultExpandAll?: boolean
  /** 受控：当前选中的 keys */
  selectedKeys?: Key[]
  /** 非受控：默认选中的 keys */
  defaultSelectedKeys?: Key[]
  /** 是否支持多选 */
  multiple?: boolean
  /** 点击节点的回调 */
  onSelect?: (selectedKeys: Key[], node: TreeNodeType) => void
  /** 展开/收起的回调 */
  onExpand?: (expandedKeys: Key[], node: TreeNodeType) => void
  /** 异步加载子节点数据 */
  loadData?: (node: TreeNodeType) => Promise<void>
  className?: string
  style?: CSSProperties
}
