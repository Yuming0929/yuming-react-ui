import React, { useState, useRef, useEffect, ReactElement, cloneElement } from 'react'
import classNames from 'classnames'
import { TooltipProps, TooltipPlacement } from './type'
import styles from './tooltip.module.scss'
import { c, l } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'

export const Tooltip = ({
  title,
  children,
  placement = 'top',
  trigger = 'hover',
  disabled = false,
  delay = 0,
  className,
  style,
  showArrow = true
}: TooltipProps) => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)

  // 计算tooltip 位置
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const gap = 8 // 间距

    let top = 0
    let left = 0

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'bottom':
        top = triggerRect.bottom + gap
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        break
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.left - tooltipRect.width - gap
        break
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        left = triggerRect.right + gap
        break
    }

    setPosition({ top, left })
  }

  const showTooltip = () => {
    if (disabled) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = window.setTimeout(() => {
      calculatePosition()
      setVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      e.preventDefault()
      e.stopPropagation()
      if (visible) {
        hideTooltip()
      } else {
        showTooltip()
      }
    }
  }

  // 计算位置 和 事件监听
  useEffect(() => {
    if (visible) {
      calculatePosition()
      const handleResize = () => calculatePosition()
      const handleScroll = () => calculatePosition()
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [visible, placement])

  // 绑定事件
  const childElement = React.Children.only(children) as ReactElement<any>
  const triggerProps: any = {
    ref: triggerRef
  }

  if (trigger === 'hover') {
    triggerProps.onMouseEnter = showTooltip
    triggerProps.onMouseLeave = hideTooltip
  } else if (trigger === 'click') {
    triggerProps.onClick = handleClick
  } else if (trigger === 'focus') {
    triggerProps.onFocus = showTooltip
    triggerProps.onBlur = hideTooltip
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // 渲染
  return (
    <>
      {cloneElement(childElement, triggerProps)}
      {visible && (
        <div
          ref={tooltipRef}
          className={classNames(styles['tooltip'], styles[`tooltip--${placement}`], className)}
          style={{ top: `${position.top}px`, left: `${position.left}px`, ...style }}
          role="tooltip"
          aria-hidden={!visible}
        >
          <div className={styles.tooltipContent}>{title}</div>
          {showArrow && <div className={classNames(styles.arrow, styles[`arrow--${placement}`])} />}
        </div>
      )}
    </>
  )
}
