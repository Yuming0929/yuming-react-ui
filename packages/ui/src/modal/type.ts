import { ReactNode, CSSProperties } from 'react'

export interface ModalProps {
  /** 是否可见 */
  isOpen: boolean
  /** 关闭的回调 */
  onClose: () => void
  /** 标题 */
  title?: ReactNode
  /** 内容 */
  children?: ReactNode
  /** 底部内容，传 null 则隐藏 */
  footer?: ReactNode
  /** 点击蒙层是否允许关闭 */
  maskClosable?: boolean
  /** 是否显示右上角关闭按钮 */
  showCloseIcon?: boolean
  /** 宽度 */
  width?: number | string
  /** 垂直居中展示 */
  centered?: boolean
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 点击确认的回调 */
  onOk?: () => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
}
