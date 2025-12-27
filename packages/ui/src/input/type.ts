import { InputHTMLAttributes, ReactNode } from 'react'

export type InputSize = 'small' | 'medium' | 'large'
export type InputStatus = 'default' | 'success' | 'warning' | 'error'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  /**
   * 输入框尺寸
   * @default 'medium'
   */
  size?: InputSize
  /**
   * 输入框状态
   * @default 'default'
   */
  status?: InputStatus
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 是否只读
   * @default false
   */
  readOnly?: boolean
  /**
   * 是否显示清除按钮（仅在受控模式下有效）
   * @default false
   */
  allowClear?: boolean
  /**
   * 带标签的 input，设置前置标签
   */
  addonBefore?: ReactNode
  /**
   * 带标签的 input，设置后置标签
   */
  addonAfter?: ReactNode
  /**
   * 带有前缀图标的 input
   */
  prefix?: ReactNode
  /**
   * 带有后缀图标的 input
   */
  suffix?: ReactNode
  /**
   * 输入框内容变化时的回调
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * 输入框获得焦点时的回调
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  /**
   * 输入框失去焦点时的回调
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  /**
   * 按下回车键时的回调
   */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}