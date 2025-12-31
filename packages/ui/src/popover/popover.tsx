import React, { useState, useRef, useEffect, ReactElement, cloneElement } from 'react'
import classNames from 'classnames'
import { PopoverProps, PopoverPlacement } from './type'
import styles from './popover.module.scss'
import { X } from 'lucide-react'

export const Popover = ({
  title,
  content,
  children,
  placement = 'bottom',
  trigger = 'click',
  disabled = false,
  delay = 0,
  className,
  style,
  showArrow = true,
  showClose = false,
  closeOnClickOutside = true,
  onVisibleChange,
  visible: controlledVisible,
  defaultVisible = false
}: PopoverProps) => {
  // 受控和非受控模式
  const [internalVisible, setInternalVisible] = useState(defaultVisible)
  const visible = controlledVisible !== undefined ? controlledVisible : internalVisible

  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)

  // 计算 popover 位置
  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const popoverRect = popoverRef.current.getBoundingClientRect()
    const gap = 8 // 间距
    const scrollX = window.scrollX || window.pageXOffset
    const scrollY = window.scrollY || window.pageYOffset

    let top = 0
    let left = 0

    switch (placement) {
      case 'top':
        top = scrollY + triggerRect.top - popoverRect.height - gap
        left = scrollX + triggerRect.left + (triggerRect.width - popoverRect.width) / 2
        break
      case 'bottom':
        top = scrollY + triggerRect.bottom + gap
        left = scrollX + triggerRect.left + (triggerRect.width - popoverRect.width) / 2
        break
      case 'left':
        top = scrollY + triggerRect.top + (triggerRect.height - popoverRect.height) / 2
        left = scrollX + triggerRect.left - popoverRect.width - gap
        break
      case 'right':
        top = scrollY + triggerRect.top + (triggerRect.height - popoverRect.height) / 2
        left = scrollX + triggerRect.right + gap
        break
      case 'topLeft':
        top = scrollY + triggerRect.top - popoverRect.height - gap
        left = scrollX + triggerRect.left
        break
      case 'topRight':
        top = scrollY + triggerRect.top - popoverRect.height - gap
        left = scrollX + triggerRect.right - popoverRect.width
        break
      case 'bottomLeft':
        top = scrollY + triggerRect.bottom + gap
        left = scrollX + triggerRect.left
        break
      case 'bottomRight':
        top = scrollY + triggerRect.bottom + gap
        left = scrollX + triggerRect.right - popoverRect.width
        break
      case 'leftTop':
        top = scrollY + triggerRect.top
        left = scrollX + triggerRect.left - popoverRect.width - gap
        break
      case 'leftBottom':
        top = scrollY + triggerRect.bottom - popoverRect.height
        left = scrollX + triggerRect.left - popoverRect.width - gap
        break
      case 'rightTop':
        top = scrollY + triggerRect.top
        left = scrollX + triggerRect.right + gap
        break
      case 'rightBottom':
        top = scrollY + triggerRect.bottom - popoverRect.height
        left = scrollX + triggerRect.right + gap
        break
    }

    setPosition({ top, left })
  }

  // 更新可见性
  const updateVisible = (newVisible: boolean) => {
    if (controlledVisible === undefined) {
      setInternalVisible(newVisible)
    }
    onVisibleChange?.(newVisible)
  }

  // 显示 popover
  const showPopover = () => {
    if (disabled || visible) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      calculatePosition()
      updateVisible(true)
    }, delay)
  }

  // 隐藏 popover
  const hidePopover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    updateVisible(false)
  }

  // 处理点击
  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      e.preventDefault()
      e.stopPropagation()
      if (visible) {
        hidePopover()
      } else {
        showPopover()
      }
    }
  }

  // 点击外部关闭
  useEffect(() => {
    if (visible && closeOnClickOutside && trigger === 'click') {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node
        if (
          popoverRef.current &&
          !popoverRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          hidePopover()
        }
      }

      // 使用捕获阶段确保先执行
      document.addEventListener('mousedown', handleClickOutside, true)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true)
      }
    }
  }, [visible, closeOnClickOutside, trigger])

  // 计算位置和事件监听
  useEffect(() => {
    if (visible) {
      calculatePosition()
      const handleResize = () => calculatePosition()
      const handleScroll = () => calculatePosition()
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, true)
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [visible, placement])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 绑定事件
  const childElement = React.Children.only(children) as ReactElement<any>
  const triggerProps: any = {
    ref: triggerRef
  }

  if (trigger === 'hover') {
    triggerProps.onMouseEnter = showPopover
    triggerProps.onMouseLeave = hidePopover
    // 防止鼠标移入 popover 时关闭
    if (popoverRef.current) {
      popoverRef.current.addEventListener('mouseenter', showPopover)
      popoverRef.current.addEventListener('mouseleave', hidePopover)
    }
  } else if (trigger === 'click') {
    triggerProps.onClick = handleClick
  } else if (trigger === 'focus') {
    triggerProps.onFocus = showPopover
    triggerProps.onBlur = hidePopover
  }

  // 处理关闭按钮
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    hidePopover()
  }

  // 获取基础位置类名（用于箭头定位）
  const getBasePlacement = (placement: PopoverPlacement): string => {
    if (placement.startsWith('top')) return 'top'
    if (placement.startsWith('bottom')) return 'bottom'
    if (placement.startsWith('left')) return 'left'
    if (placement.startsWith('right')) return 'right'
    return placement
  }

  const basePlacement = getBasePlacement(placement)

  return (
    <>
      {
        cloneElement(childElement, triggerProps) // 克隆触发元素并添加事件监听
      }
      {visible && (
        <div
          ref={popoverRef}
          className={classNames(styles.popover, styles[`popover--${basePlacement}`], className)}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            ...style
          }}
          role="dialog"
          aria-hidden={!visible}
        >
          {showArrow && (
            <div className={classNames(styles.arrow, styles[`arrow--${basePlacement}`])} />
          )}
          {title && (
            <div className={styles.popoverHeader}>
              <div className={styles.popoverTitle}>{title}</div>
              {showClose && (
                <button
                  type="button"
                  className={styles.popoverClose}
                  onClick={handleClose}
                  aria-label="关闭"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
          <div className={styles.popoverContent}>{content}</div>
        </div>
      )}
    </>
  )
}
