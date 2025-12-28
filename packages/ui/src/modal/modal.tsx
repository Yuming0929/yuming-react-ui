import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { ModalProps } from './type'
import { Button } from '../button'
import styles from './modal.module.scss'
import { X } from 'lucide-react'

// 获取滚动条宽度
const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maskClosable = true,
  showCloseIcon = true,
  width = 520,
  centered = false,
  okText = '确定',
  cancelText = '取消',
  onOk,
  className,
  style
}: ModalProps) => {
  const [exiting, setExiting] = useState(false)
  // modal 打开时让页面无法滚动
  useEffect(() => {
    // 缓存原来的样式，以便恢复
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    if (isOpen) {
      // 1. 计算滚动条宽度
      const scrollBarWidth = getScrollbarWidth()

      // 2. 只有当页面确实有滚动条时（宽度 > 0），才添加 padding
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }

      // 3. 锁定滚动
      document.body.style.overflow = 'hidden'
    }

    // 清理函数：关闭弹窗或组件卸载时恢复
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isOpen])

  // 3. 遮罩层点击处理
  const handleMaskClick = () => {
    if (maskClosable) {
      handleClose()
    }
  }

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => {
      setExiting(false)
      onClose()
    }, 200)
  }

  // 默认页脚
  const defaultFooter = (
    <div className={styles['modal-footer']}>
      <Button onClick={handleClose} style={{ marginRight: '8px' }}>
        {cancelText}
      </Button>
      <Button variant="primary" onClick={onOk || handleClose}>
        {okText}
      </Button>
    </div>
  )

  // 渲染内容
  const modalContent = (
    <div className={styles['modal-root']}>
      {/* 遮罩层 */}
      <div className={styles['modal-mask']} onClick={handleMaskClick} />

      {/* 弹窗容器 */}
      <div
        className={classNames(styles['modal-wrap'], {
          [styles['modal-wrap--centered']]: centered
        })}
        onClick={handleMaskClick} // 这里也绑定点击，是为了处理 wrap 的空白区域
      >
        <div
          className={classNames(
            styles['modal'],
            {
              [styles['modal-exit']]: exiting
            },
            className
          )}
          style={{ width, ...style }}
          // 核心：阻止冒泡，防止点击 Modal 内容时触发遮罩层的关闭事件
          onClick={e => e.stopPropagation()}
        >
          {/* 1. Header */}
          <div className={styles['modal-header']}>
            <div className={styles['modal-title']}>{title}</div>
            {showCloseIcon && (
              <Button className={styles['modal-close']} onClick={handleClose}>
                <X size={16} />
              </Button>
            )}
          </div>

          {/* 2. Body */}
          <div className={styles['modal-body']}>{children}</div>

          {/* 3. Footer */}
          {footer === null ? null : footer || defaultFooter}
        </div>
      </div>
    </div>
  )

  if (!isOpen) {
    return null
  }

  return createPortal(modalContent, document.body)
}
