import React, { forwardRef, useState, useCallback } from 'react'
import { InputProps } from './type'
import classNames from 'classnames'
import styles from './input.module.scss'
import { X, Eye, EyeOff } from 'lucide-react'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'medium',
      status = 'default',
      disabled = false,
      readOnly = false,
      allowClear = false,
      addonBefore,
      addonAfter,
      prefix,
      suffix,
      type = 'text',
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onPressEnter,
      onKeyDown,
      ...restProps
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue || '')
    const isControlled = value !== undefined // 判断是否是受控模式
    const currentValue = isControlled ? value : internalValue // 受控模式下，使用外部传入的值，否则使用内部维护的值
    const showClear = allowClear && !disabled && !readOnly && currentValue

    // 处理密码类型
    const [passwordVisible, setPasswordVisible] = useState(false)
    const inputType =
      type === 'password' ? (passwordVisible ? 'text' : 'password') : type

    // 处理清除
    const handleClear = useCallback(
      (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation()
        if (isControlled) {
          onChange?.({
            target: { value: '' },
          } as React.ChangeEvent<HTMLInputElement>)
        } else {
          setInternalValue('')
          onChange?.({
            target: { value: '' },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      },
      [isControlled, onChange]
    )

    // 处理输入变化
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(e.target.value)
        }
        onChange?.(e)
      },
      [isControlled, onChange]
    )

    // 处理焦点
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true)
        onFocus?.(e)
      },
      [onFocus]
    )

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    // 处理按键
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onPressEnter?.(e)
        }
        onKeyDown?.(e)
      },
      [onPressEnter, onKeyDown]
    )

    // 切换密码可见性
    const togglePasswordVisible = useCallback(
      (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation()
        setPasswordVisible(!passwordVisible)
      },
      [passwordVisible]
    )

    const inputClasses = classNames(
      styles.input,
      styles[`input--${size}`],
      styles[`input--${status}`],
      {
        [styles['input--disabled']]: disabled,
        [styles['input--readonly']]: readOnly,
        [styles['input--focused']]: focused,
        [styles['input--with-prefix']]: prefix,
        [styles['input--with-suffix']]: suffix || showClear || type === 'password'
      },
      className
    )

    const wrapperClasses = classNames(styles.inputWrapper, {
      [styles['input-wrapper--disabled']]: disabled,
      [styles['input-wrapper--focused']]: focused,
      [styles['input-wrapper--with-addon']]: addonBefore || addonAfter
    })

    const inputElement = (
      <div className={wrapperClasses}>
        {prefix && <span className={styles.inputPrefix}>{prefix}</span>}
        <input
          ref={ref}
          className={inputClasses}
          type={inputType}
          value={isControlled ? value : currentValue}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...restProps}
        />
        {(suffix || showClear || type === 'password') && (
          <span className={styles.inputSuffix}>
            {type === 'password' && (
              <span
                className={styles.inputPasswordToggle}
                onClick={togglePasswordVisible}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    togglePasswordVisible(e as any)
                  }
                }}
              >
                {passwordVisible ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </span>
            )}
            {showClear && (
              <span
                className={styles.inputClear}
                onClick={handleClear}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClear(e as any)
                  }
                }}
              >
                <X size={14} />
              </span>
            )}
            {suffix && <span className={styles.inputSuffixIcon}>{suffix}</span>}
          </span>
        )}
      </div>
    )

    // 带前后缀标签
    if (addonBefore || addonAfter) {
      return (
        <span className={styles.inputGroup}>
          {addonBefore && (
            <span className={styles.inputAddonBefore}>{addonBefore}</span>
          )}
          {inputElement}
          {addonAfter && (
            <span className={styles.inputAddonAfter}>{addonAfter}</span>
          )}
        </span>
      )
    }

    return inputElement
  }
)

Input.displayName = 'Input'
