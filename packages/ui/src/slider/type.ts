import { ReactNode, CSSProperties } from 'react'

export interface SliderProps {
  /** 滑块的值 */
  value?: number
  /** 滑块的默认值 */
  defaultValue?: number
  /** 滑块的最小值 */
  min?: number
  /** 滑块的最大值 */
  max?: number
  /** 滑块的步长 */
  step?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 滑块变化时的回调 */
  onChange?: (value: number) => void
  /** 鼠标抬起时的回调 (用于性能敏感场景) */
  onAfterChange?: (value: number) => void
  /** 自定义格式化 Tooltip */
  formatTooltip?: (value: number) => ReactNode
  /** 标记点，key 为数值，value 为显示的标签 */
  marks?: Record<number, ReactNode>
  /** 是否显示点状标记 */
  dots?: boolean
  /** 是否垂直方向 */
  vertical?: boolean
  /** 滑块的样式 */
  style?: CSSProperties
  /** 滑块的类名 */
  className?: string
}
