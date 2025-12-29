import React, { useContext } from 'react'
import classNames from 'classnames'
import { AccordionItemProps } from './type'
import { AccordionContext } from './context'
import styles from './accordion.module.scss'
import { ChevronDown } from 'lucide-react'

export const AccordionItem = ({
  value,
  title,
  children,
  disabled,
  className
}: AccordionItemProps) => {
  const context = useContext(AccordionContext)

  // 必须在Accorion 内部使用
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion')
  }

  const { activeKeys, toggleItem } = context
  const isActive = activeKeys.includes(value)

  const handleClick = () => {
    if (disabled) return
    toggleItem(value)
  }

  return (
    <div
      className={classNames(styles.item, className, {
        [styles['item--active']]: isActive,
        [styles['item--disabled']]: disabled
      })}
    >
      {/* 头部标题区域 */}
      <button
        type="button"
        className={styles.header}
        onClick={handleClick}
        aria-expanded={isActive}
        disabled={disabled}
      >
        <span className={styles.title}>{title}</span>
        <ChevronDown className={styles.icon} size={12} />
      </button>
      {/* 内容区域 */}
      <div
        className={styles.contentWrapper}
        role="region"
        aria-labelledby={`accordion-title-${value}`}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
