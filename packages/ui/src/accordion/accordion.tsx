import React, { useState, useMemo } from 'react'
import classNames from 'classnames'
import { AccordionProps, AccordionKey } from './type'
import { AccordionContext } from './context'
import styles from './accordion.module.scss'

export const Accordion = ({
  activeKey, // 受控模式
  defaultActiveKey, // 非受控模式
  onChange,
  multiple = false,
  children,
  className,
  style
}: AccordionProps) => {
  // 处理受控模式和非受控模式的逻辑
  const [internalActiveKeys, setInternalActiveKeys] = useState<AccordionKey[]>(() => {
    if (defaultActiveKey === undefined) return []
    return Array.isArray(defaultActiveKey) ? defaultActiveKey : [defaultActiveKey]
  })
  // 计算当前实际生效的 keys (优先取受控属性 activeKey)
  const currentActiveKeys = useMemo(() => {
    if (activeKey !== undefined) {
      return Array.isArray(activeKey) ? activeKey : [activeKey]
    }
    return internalActiveKeys
  }, [activeKey, internalActiveKeys])

  // 处理切换逻辑
  const toggleItem = (key: AccordionKey) => {
    let nextKeys: AccordionKey[]
    if (multiple) {
      nextKeys = currentActiveKeys.includes(key)
        ? currentActiveKeys.filter(k => k !== key)
        : [...currentActiveKeys, key]
    } else {
      nextKeys = currentActiveKeys.includes(key) ? [] : [key]
    }

    // 更新状态
    if (activeKey === undefined) {
      setInternalActiveKeys(nextKeys)
    }

    // 触发回调
    const onChangeValue = multiple ? nextKeys : (nextKeys[0] as AccordionKey)
    onChange?.(onChangeValue)
  }

  return (
    <AccordionContext.Provider
      value={{
        activeKeys: currentActiveKeys,
        toggleItem
      }}
    >
      <div className={classNames(styles.accordion, className)} style={style}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}
