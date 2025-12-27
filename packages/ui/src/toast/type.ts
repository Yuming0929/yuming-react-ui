import { ReactNode, CSSProperties } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastProps {
    id: string
    content: ReactNode
    type?: ToastType
    duration?: number // 自动关闭时间，单位 ms
    onClose?: (id: string) => void
}

// 暴露给用户的配置选项
export interface ToastOptions {
    duration?: number
    className?: string
    style?: CSSProperties
}