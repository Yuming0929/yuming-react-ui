import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastMessage } from './ToastMessage'
import { ToastProps, ToastType, ToastOptions } from './type'
import styles from './toast.module.scss'

// --- ToastManager 组件 ---
// 负责维护 Toast 列表状态
export interface ToastManagerRef {
    add: (toast: Omit<ToastProps, 'onClose'>) => void
    remove: (id: string) => void
}

export const ToastManager = forwardRef<ToastManagerRef, {}>((_, ref) => {
    const [toasts, setToasts] = useState<ToastProps[]>([])
  
    useImperativeHandle(ref, () => ({
      add(toast) {
        setToasts((prev) => [...prev, { ...toast, onClose: remove }])
      },
      remove
    }))
  
    const remove = (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }
    
    return (
      <div className={styles['toast-container']}>
        {toasts.map((item) => (
          <ToastMessage key={item.id} {...item} />
        ))
    }
      </div>
    )
  })


