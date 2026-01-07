import { ReactNode, CSSProperties } from 'react'

export type FormSize = 'small' | 'medium' | 'large'
export type FormLayout = 'horizontal' | 'vertical' | 'inline'

// 验证规则
export interface Rule {
  /** 是否必填 */
  required?: boolean
  /** 自定义验证函数 */
  validator?: (value: any, formValues?: Record<string, any>) => Promise<void> | void
  /** 错误提示信息 */
  message?: string
  /** 最小长度 */
  min?: number
  /** 最大长度 */
  max?: number
  /** 正则表达式 */
  pattern?: RegExp
  /** 自定义类型验证 */
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url'
}

// 字段元数据
export interface FieldData {
  name: string
  value?: any
  errors?: string[]
  /** 是否已触摸 */
  touched?: boolean
}

// Form 实例方法
export interface FormInstance {
  /** 获取表单所有值 */
  getFieldsValue: (nameList?: string[]) => Record<string, any>
  /** 获取单个字段值 */
  getFieldValue: (name: string) => any
  /** 设置单个字段值 */
  setFieldValue: (name: string, value: any) => void
  /** 设置多个字段值 */
  setFieldsValue: (values: Record<string, any>) => void
  /** 重置表单 */
  resetFields: () => void
  /** 验证所有字段 */
  validateFields: () => Promise<boolean>
  /** 验证单个字段 */
  validateField: (name: string) => Promise<boolean>
  /** 获取字段错误信息 */
  getFieldError: (name: string) => string[]
  /** 获取所有字段错误 */
  getFieldsError: () => Record<string, string[]>
  /** 提交表单 */
  submit: () => void
}

export interface FormProps {
  /** Form 实例，通过 Form.useForm() 创建 */
  form?: FormInstance
  /** 表单初始值 */
  initialValues?: Record<string, any>
  /** 表单值（受控模式） */
  values?: Record<string, any>
  /** 表单值变化回调 */
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void
  /** 表单提交回调 */
  onFinish?: (values: Record<string, any>) => void
  /** 表单提交失败回调 */
  onFinishFailed?: (errors: Record<string, string[]>) => void
  /** 表单布局 */
  layout?: FormLayout
  /** 尺寸 */
  size?: FormSize
  /** 标签宽度 */
  labelWidth?: number | string
  /** 标签对齐方式 */
  labelAlign?: 'left' | 'right'
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 子元素 */
  children?: ReactNode
}

export interface FormItemProps {
  /** 字段名 */
  name?: string
  /** 标签 */
  label?: ReactNode
  /** 标签宽度 */
  labelWidth?: number | string
  /** 是否必填 */
  required?: boolean
  /** 验证规则 */
  rules?: Rule[]
  /** 提示信息 */
  help?: ReactNode
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 子元素（通常是输入控件） */
  children?: ReactNode
  /** 是否隐藏标签 */
  noStyle?: boolean
  /** 额外的表单项内容 */
  extra?: ReactNode
}
