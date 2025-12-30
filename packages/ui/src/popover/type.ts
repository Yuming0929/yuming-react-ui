import { ReactNode, CSSProperties } from 'react'

export type PopoverPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'
export type PopoverTrigger = 'hover' | 'click' | 'focus'

export interface PopoverProps {
  /** 标题内容 */
  title?: ReactNode
  /** 内容区域 */
  content: ReactNode
  /** 触发元素 */
  children: ReactNode
  /** Popover 的位置 */
  placement?: PopoverPlacement
  /** 触发方式 */
  trigger?: PopoverTrigger
  /** 是否禁用 */
  disabled?: boolean
  /** 延迟显示时间（毫秒） */
  delay?: number
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 是否显示箭头 */
  showArrow?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 点击外部是否关闭 */
  closeOnClickOutside?: boolean
  /** 可见性变化回调 */
  onVisibleChange?: (visible: boolean) => void
  /** 是否受控（外部控制显示/隐藏） */
  visible?: boolean
  /** 默认是否可见 */
  defaultVisible?: boolean
}
