import { useContext, useEffect, useCallback, useMemo, cloneElement, isValidElement } from 'react'
import classNames from 'classnames'
import { FormItemProps, Rule } from './type'
import { FormContext } from './context'
import styles from './form.module.scss'

export const FormItem = ({
  name,
  label,
  labelWidth,
  required = false,
  rules = [],
  help,
  className,
  style,
  children,
  noStyle = false,
  extra
}: FormItemProps) => {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('FormItem must be used within a Form')
  }

  const {
    layout,
    labelWidth: contextLabelWidth,
    labelAlign,
    disabled,
    getFieldValue,
    getFieldError,
    setFieldValue,
    validateField,
    registerField,
    unregisterField,
    registerFieldRules
  } = context

  // 合并规则
  const allRules = useMemo(() => {
    const mergedRules: Rule[] = [...rules]
    if (required && !mergedRules.some(rule => rule.required)) {
      mergedRules.unshift({ required: true, message: `${label || '此字段'}是必填项` })
    }
    return mergedRules
  }, [rules, required, label])

  // 注册字段和规则
  useEffect(() => {
    if (name) {
      registerField(name)
      registerFieldRules(name, allRules)
      return () => {
        unregisterField(name)
      }
    }
  }, [name, registerField, unregisterField, registerFieldRules, allRules])

  // 获取字段值和错误
  const fieldValue = name ? getFieldValue(name) : undefined
  const errors = name ? getFieldError(name) : []
  const hasError = errors.length > 0

  // 处理子组件值变化
  const handleChange = useCallback(
    (value: any) => {
      if (name) {
        setFieldValue(name, value)

        // 实时验证（如果字段已被触摸）
        const field = context.fields.get(name)
        if (field?.touched) {
          validateField(name, allRules)
        }
      }
    },
    [name, setFieldValue, validateField, allRules, context]
  )

  // 处理失焦验证
  const handleBlur = useCallback(async () => {
    if (name && allRules.length > 0) {
      await validateField(name, allRules)
    }
  }, [name, validateField, allRules])

  // 克隆子元素并注入 props
  const childElement = useMemo(() => {
    if (!children || !isValidElement(children)) {
      return children
    }

    const childProps: any = {
      disabled: disabled || children.props.disabled,
      status: hasError ? 'error' : children.props.status
    }

    // 注入值相关 props
    if (name) {
      // 处理值注入 - 对于所有受控组件都注入 value
      childProps.value = fieldValue !== undefined ? fieldValue : ''

      // 处理 onChange
      const originalOnChange = children.props.onChange
      childProps.onChange = (e: any) => {
        let value: any
        // 兼容不同组件的 onChange 参数格式
        if (e && typeof e === 'object') {
          if (e.target !== undefined && 'value' in e.target) {
            // Input 等标准组件 (React.ChangeEvent<HTMLInputElement>)
            value = e.target.value
          } else if ('value' in e) {
            // 某些自定义组件可能使用 { value } 格式
            value = e.value
          } else {
            // 直接传值的情况（如 Select 组件直接传值）
            value = e
          }
        } else {
          // 直接传递原始值（如 Select 组件：onChange(option.value)）
          value = e
        }
        handleChange(value)
        originalOnChange?.(e)
      }

      // 处理 onBlur
      const originalOnBlur = children.props.onBlur
      childProps.onBlur = (e: any) => {
        handleBlur()
        originalOnBlur?.(e)
      }
    }

    return cloneElement(children, childProps)
  }, [children, name, fieldValue, disabled, hasError, handleChange, handleBlur])

  // 计算标签宽度
  const computedLabelWidth = labelWidth || contextLabelWidth

  const itemClasses = classNames(
    styles.formItem,
    styles[`form-item--${layout}`],
    {
      [styles['form-item--error']]: hasError,
      [styles['form-item--no-style']]: noStyle
    },
    className
  )

  if (noStyle) {
    return <>{childElement}</>
  }

  return (
    <div className={itemClasses} style={style}>
      {label && (
        <div
          className={classNames(styles.formItemLabel, styles[`form-item-label--${labelAlign}`])}
          style={computedLabelWidth ? { width: computedLabelWidth } : undefined}
        >
          {required && <span className={styles.formItemRequired}>*</span>}
          {label}
        </div>
      )}
      <div className={styles.formItemControl}>
        <div className={styles.formItemControlInput}>{childElement}</div>
        {help && !hasError && <div className={styles.formItemHelp}>{help}</div>}
        {hasError && (
          <div className={styles.formItemError}>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
        {extra && <div className={styles.formItemExtra}>{extra}</div>}
      </div>
    </div>
  )
}
