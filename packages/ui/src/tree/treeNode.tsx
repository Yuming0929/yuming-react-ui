import React, { useContext, useState } from 'react'
import classNames from 'classnames'
import { TreeNodeType } from './type'
import { TreeContext } from './context'
import styles from './tree.module.scss'
import { ChevronRight, File, Folder, FolderOpen, Loader2 } from 'lucide-react'

interface TreeNodeProps {
  item: TreeNodeType
  level?: number // 当前层级，用于缩进计算
  onLoadData?: (node: TreeNodeType) => Promise<void>
}

export const TreeNode = ({ item, level = 0, onLoadData }: TreeNodeProps) => {
  const context = useContext(TreeContext)
  if (!context) throw new Error('TreeNode must be used within a Tree')

  const { expandedKeys, selectedKeys, onExpand, onSelect } = context

  const isExpanded = expandedKeys.includes(item.key)
  const isSelected = selectedKeys.includes(item.key)
  const [loading, setLoading] = useState(item.loading ?? false)
  const hasChildren = item.children && item.children.length > 0
  // 如果节点不是叶子节点，或者有子节点，或者有 loadData 函数，则显示箭头
  const shouldShowSwitcher = !item.isLeaf && (hasChildren || !!onLoadData)

  // 展开（仅箭头区域，阻止冒泡避免触发节点选中）
  const handleExpand = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.disabled) return
    if (item.isLeaf) return // 叶子节点不能展开

    // 如果节点没有子节点且提供了 loadData，则先加载数据
    if (onLoadData && !hasChildren && !isExpanded) {
      setLoading(true)
      try {
        await onLoadData(item)
      } finally {
        setLoading(false)
      }
    }
    onExpand(item.key, item)
  }

  // 点击节点内容区域：选中节点
  const handleNodeClick = (e: React.MouseEvent) => {
    if (item.disabled) return
    onSelect(item.key, item)
  }

  const renderIcon = () => {
    if (item.icon) return <span className={styles.customIcon}>{item.icon}</span>
    if (hasChildren) {
      return isExpanded ? (
        <FolderOpen size={16} color="#e8a83e" />
      ) : (
        <Folder size={16} color="#e8a83e" />
      )
    }
    return <File size={16} color="#666" />
  }

  return (
    <div className={styles.nodeWrapper}>
      <div
        className={classNames(styles.nodeContent, {
          [styles['nodeContent--selected']]: isSelected,
          [styles['nodeContent--disabled']]: item.disabled
        })}
        onClick={handleNodeClick}
        style={{ paddingLeft: `${level * 10}px` }}
      >
        {/* 展开箭头 或 加载中 */}
        {loading ? (
          <Loader2 size={14} className={styles.loadingIcon} />
        ) : (
          <span
            className={classNames(styles.switcher, {
              [styles['switcher--expanded']]: isExpanded,
              [styles['switcher--hidden']]: !shouldShowSwitcher
            })}
            onClick={handleExpand}
          >
            <ChevronRight size={14} />
          </span>
        )}

        {/* 图标 */}
        <span className={styles.iconWrapper}>{renderIcon()}</span>
        {/* 标题 */}
        <span className={styles.title}>{item.title}</span>
      </div>
      {/* 子节点列表(递归渲染) */}
      {hasChildren && (
        <div
          className={classNames(styles.childrenWrapper, {
            [styles['childrenWrapper--expanded']]: isExpanded
          })}
          role="group"
        >
          <div className={styles.childrenInner}>
            {item.children!.map(child => (
              <TreeNode key={child.key} item={child} level={level + 1} onLoadData={onLoadData} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
