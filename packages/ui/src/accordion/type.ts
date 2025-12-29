import { ReactNode, CSSProperties } from 'react'

export type AccordionKey = string | number

export interface AccordionProps {
  /** 当前激活的 key (受控模式) */
  activeKey?: AccordionKey | AccordionKey[]
  /** 默认激活的 key (非受控模式) */
  defaultActiveKey?: AccordionKey | AccordionKey[]
  /** 切换面板的回调 */
  onChange?: (key: AccordionKey | AccordionKey[]) => void
  /** 是否允许展开多个面板 */
  multiple?: boolean
  /** 内容 */
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface AccordionItemProps {
  /** 唯一标识符 */
  value: AccordionKey
  /** 标题 */
  title: ReactNode
  /** 是否禁用 */
  disabled?: boolean
  children?: ReactNode
  className?: string
}
