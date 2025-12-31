import { ReactNode, CSSProperties } from 'react'

export type SelectSize = 'small' | 'medium' | 'large'
export type SelectStatus = 'default' | 'success' | 'warning' | 'error'

export interface SelectOption {
  /** 选项的值 */
  value: string | number
  /** 选项的标签 */
  label: ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 选项分组（可选） */
  group?: string
}

export interface SelectProps {
  /** 选择框的值（单选） */
  value?: string | number
  /** 选择框的值（多选） */
  values?: (string | number)[]
  /** 默认值（单选） */
  defaultValue?: string | number
  /** 默认值（多选） */
  defaultValues?: (string | number)[]
  /** 选项列表 */
  options?: SelectOption[]
  /** 是否多选 */
  multiple?: boolean
  /** 占位符 */
  placeholder?: string
  /** 尺寸 */
  size?: SelectSize
  /** 状态 */
  status?: SelectStatus
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可清空 */
  allowClear?: boolean
  /** 是否可搜索 */
  searchable?: boolean
  /** 自定义搜索过滤函数 */
  filterOption?: (input: string, option: SelectOption) => boolean
  /** 值变化时的回调 */
  onChange?: (value: string | number | (string | number)[]) => void
  /** 下拉框打开时的回调 */
  onOpen?: () => void
  /** 下拉框关闭时的回调 */
  onClose?: () => void
  /** 搜索输入时的回调 */
  onSearch?: (searchText: string) => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 下拉框的宽度 */
  dropdownWidth?: number | string
  /** 是否显示加载状态 */
  loading?: boolean
  /** 没有数据时的提示 */
  notFoundContent?: ReactNode
}
