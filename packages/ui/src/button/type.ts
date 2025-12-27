import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'error'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮类型
   * @default 'default'
   */
  variant?: ButtonType
  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: ButtonSize
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean
  /**
   * 是否块级按钮
   * @default false
   */
  block?: boolean
  /**
   * 按钮内容
   */
  children?: ReactNode
}

