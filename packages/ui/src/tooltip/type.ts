import { ReactNode, CSSProperties } from 'react'

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'
export type TooltipTrigger = 'hover' | 'click' | 'focus'

export interface TooltipProps {
  /** 显示内容 */
  title: ReactNode
  /** 子元素 */
  children: ReactNode
  /** 位置 */
  placement?: TooltipPlacement
  /** 触发方式 */
  trigger?: TooltipTrigger
  /** 是否禁用 */
  disabled?: boolean
  /** 延迟时间 */
  delay?: number
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 是否显示箭头 */
  showArrow?: boolean
}
