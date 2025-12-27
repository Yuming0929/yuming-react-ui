import React, { forwardRef } from 'react'
import { ButtonProps } from './type'
import styles from './button.module.scss'
import classNames from 'classnames'
import { Loader2 } from 'lucide-react'

// forwardRef 可以让父组件通过 ref 访问到子组件的实例
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      disabled = false,
      loading = false,
      block = false,
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const classes = classNames(
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      {
        [styles['button--disabled']]: disabled || loading,
        [styles['button--loading']]: loading,
        [styles['button--block']]: block
      },
      className
    )

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...restProps}
      >
        {loading && <span className={styles['button__loading-icon']}>
          <Loader2 size={16} />
        </span>}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
