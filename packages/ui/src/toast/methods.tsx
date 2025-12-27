import React from 'react'
import { createRoot } from 'react-dom/client'
import { ToastManager, ToastManagerRef } from './ToastManager'
import { ToastOptions, ToastType } from './type'

// --- 命令式 API 实现 ---
let toastManagerRef: ToastManagerRef | null = null

// 初始化容器
const initToastContainer = () => {
    if (toastManagerRef) return // 防止重复创建

    const containerDiv = document.createElement('div')
    document.body.appendChild(containerDiv)

    const root = createRoot(containerDiv)

    // 渲染 Manager 并获取 ref
    // 注意：在 React 18 这种获取 ref 的方式需要一点技巧，
    // 或者是把 render 逻辑剥离。这里为了简化，使用简单的 ref 赋值。
    let refSetter: any

    const RefHolder = () => {
        return <ToastManager ref={ref => { toastManagerRef = ref }} />
    }

    root.render(<RefHolder />)
}

// 生成唯一 ID
let seed = 0
const getUuid = () => `toast_${Date.now()}_${seed++}`

// 核心方法
const show = (content: React.ReactNode, type: ToastType, options?: ToastOptions) => {
    if (!toastManagerRef) initToastContainer()

    // 稍微延迟确保 ref 已经挂载（生产环境建议使用队列机制）
    setTimeout(() => {
        toastManagerRef?.add({
            id: getUuid(),
            content,
            type,
            duration: options?.duration
        })
    }, 0)
}


export const toast = {
    success: (content: React.ReactNode, options?: ToastOptions) => show(content, 'success', options),
    error: (content: React.ReactNode, options?: ToastOptions) => show(content, 'error', options),
    warning: (content: React.ReactNode, options?: ToastOptions) => show(content, 'warning', options),
    info: (content: React.ReactNode, options?: ToastOptions) => show(content, 'info', options),
    loading: (content: React.ReactNode, options?: ToastOptions) => show(content, 'loading', options),
    // ...
}