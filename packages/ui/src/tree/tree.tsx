import React, { useState } from 'react'
import classNames from 'classnames'
import { TreeProps, Key, TreeNodeType } from './type'
import { TreeContext } from './context'
import { TreeNode } from './treeNode'
import styles from './tree.module.scss'

export const Tree = ({
  treeData,
  expandedKeys: propExpandedKeys,
  defaultExpandedKeys = [],
  defaultExpandAll = false,
  selectedKeys: propSelectedKeys,
  defaultSelectedKeys = [],
  multiple = false,
  onExpand,
  onSelect,
  loadData,
  className,
  style
}: TreeProps) => {
  // 状态 1: 展开
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Key[]>(() => {
    if (defaultExpandAll) {
      // 简单粗暴获取所有带 children 的 key (实际生产中需递归获取)
      return getAllKeys(treeData)
    }
    return defaultExpandedKeys
  })

  const finalExpandedKeys = propExpandedKeys ?? internalExpandedKeys

  // 状态 2: 选中
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Key[]>(defaultSelectedKeys)
  const finalSelectedKeys = propSelectedKeys ?? internalSelectedKeys

  // 逻辑处理
  const handleExpand = (key: Key, node: TreeNodeType) => {
    const newKeys = finalExpandedKeys.includes(key)
      ? finalExpandedKeys.filter(k => k !== key)
      : [...finalExpandedKeys, key]

    if (propExpandedKeys === undefined) {
      setInternalExpandedKeys(newKeys)
    }
    onExpand?.(newKeys, node)
  }
  const handleSelect = (key: Key, node: TreeNodeType) => {
    let newKeys: Key[]
    if (multiple) {
      newKeys = finalSelectedKeys.includes(key)
        ? finalSelectedKeys.filter(k => k !== key)
        : [...finalSelectedKeys, key]
    } else {
      // 单选：点击已选中的不取消（符合常见树习惯），或者切换到新的
      newKeys = [key]
    }

    if (propSelectedKeys === undefined) {
      setInternalSelectedKeys(newKeys)
    }
    onSelect?.(newKeys, node)
  }

  // 辅助：获取所有有子节点的 key (仅用于 defaultExpandAll)
  function getAllKeys(data: TreeNodeType[]): Key[] {
    let keys: Key[] = []
    data.forEach(item => {
      if (item.children) {
        keys.push(item.key)
        keys = keys.concat(getAllKeys(item.children))
      }
    })
    return keys
  }

  return (
    <TreeContext.Provider
      value={{
        expandedKeys: finalExpandedKeys,
        selectedKeys: finalSelectedKeys,
        onExpand: handleExpand,
        onSelect: handleSelect
      }}
    >
      <div className={classNames(styles.tree, className)} style={style}>
        {treeData.map(item => (
          <TreeNode key={item.key} item={item} onLoadData={loadData} />
        ))}
      </div>
    </TreeContext.Provider>
  )
}
