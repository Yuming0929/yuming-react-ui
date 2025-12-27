import React, { useEffect, useState, useRef, useCallback } from 'react'
import classNames from 'classnames'
import { ToastProps, ToastOptions } from './type'
import styles from './toast.module.scss'
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'

export const ToastMessage = ({
    id,
    content,
    type = 'info',
    duration = 3000,
    onClose,
}: ToastProps) => {
    const [visible, setVisible] = useState(false)
    const [exiting, setExiting] = useState(false)
    const [mounted, setMounted] = useState(true)
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)
    const nodeRef = React.useRef<HTMLDivElement>(null)

    // 处理退出
    const handleExit = useCallback(() => {
        setVisible(false)
        setExiting(true)
    }, [])

    // 入场动画
    useEffect(() => {
        // 延迟触发 CSS 动画，确保初始状态先应用
        requestAnimationFrame(() => {
            setVisible(true)
        })
    }, [])

    // 自动关闭逻辑
    useEffect(() => {
        if (duration > 0 && visible && !exiting) {
            timerRef.current = setTimeout(() => {
                handleExit()
            }, duration)
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [duration, visible, exiting, handleExit])

    // 退出动画完成后移除组件
    const handleTransitionEnd = (e: React.TransitionEvent) => {
        // 处理 max-height 的 transition，确保高度动画完成后再移除
        if (
            (e.propertyName === 'max-height' || e.propertyName === 'opacity') &&
            exiting &&
            mounted
        ) {
            // 确保所有动画都完成
            setTimeout(() => {
                setMounted(false)
                onClose?.(id)
            }, 100)
        }
    }

    // 如果组件已卸载，不渲染
    if (!mounted) {
        return null
    }

    const icons = {
        success: <CheckCircle size={16} />,
        error: <XCircle size={16} />,
        warning: <AlertTriangle size={16} />,
        info: <Info size={16} />,
        loading: <Loader2 size={16} className={styles.toast__loadingIcon} />,
    }

    const classes = classNames(styles.toast, styles[`toast--${type}`], {
        [styles['toast--visible']]: visible,
        [styles['toast--exiting']]: exiting,
    })

    return (
        <div
            ref={nodeRef}
            className={classes}
            onTransitionEnd={handleTransitionEnd}
        >
            <span className={styles.toast__icon}>{icons[type]}</span>
            <span className={styles.toast__content}>{content}</span>
        </div>
    )
}