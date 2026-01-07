import React, { useState, useCallback, useRef, useMemo } from 'react'
import classNames from 'classnames'
import { FormProps, FormInstance } from './type'
import { FormContext, FormContextValue } from './context'
import { validateValue } from './utils'
import { Rule, FieldData } from './type'
import styles from './form.module.scss'

export const Form = ({
  form: externalForm,
  initialValues = {},
  values: controlledValues,
  onValuesChange,
  onFinish,
  onFinishFailed,
  layout = 'vertical',
  size = 'medium',
  labelWidth,
  labelAlign = 'right',
  disabled = false,
  className,
  style,
  children
}: FormProps) => {
  // 受控和非受控模式
  const isControlled = controlledValues !== undefined
  const [internalValues, setInternalValues] = useState<Record<string, any>>(initialValues)
  // 用于强制更新
  const [, forceUpdate] = useState({})

  const formValues = isControlled ? controlledValues : internalValues

  // 字段管理
  const fieldsRef = useRef<Map<string, FieldData>>(new Map())
  const fieldRulesRef = useRef<Map<string, Rule[]>>(new Map())
  const formRef = useRef<HTMLFormElement>(null)

  // 注册字段
  const registerField = useCallback(
    (name: string) => {
      if (!fieldsRef.current.has(name)) {
        fieldsRef.current.set(name, {
          name,
          value: formValues[name],
          errors: [],
          touched: false
        })
      }
    },
    [formValues]
  )

  // 注销字段
  const unregisterField = useCallback((name: string) => {
    fieldsRef.current.delete(name)
    fieldRulesRef.current.delete(name)
  }, [])

  // 注册字段规则
  const registerFieldRules = useCallback((name: string, rules: Rule[]) => {
    fieldRulesRef.current.set(name, rules)
  }, [])

  // 设置字段值
  const setFieldValue = useCallback(
    (name: string, value: any) => {
      const newValues = { ...formValues, [name]: value }

      if (!isControlled) {
        setInternalValues(newValues)
      }

      // 更新字段数据
      const field = fieldsRef.current.get(name)
      if (field) {
        field.value = value
        field.touched = true
      }

      onValuesChange?.({ [name]: value }, newValues)
    },
    [formValues, isControlled, onValuesChange]
  )

  // 获取字段值
  const getFieldValue = useCallback(
    (name: string) => {
      return formValues[name]
    },
    [formValues]
  )

  // 获取多个字段值
  const getFieldsValue = useCallback(
    (nameList?: string[]) => {
      if (nameList) {
        const values: Record<string, any> = {}
        nameList.forEach(name => {
          values[name] = formValues[name]
        })
        return values
      }
      return { ...formValues }
    },
    [formValues]
  )

  // 获取字段错误
  const getFieldError = useCallback((name: string) => {
    return fieldsRef.current.get(name)?.errors || []
  }, [])

  // 获取所有字段错误
  const getFieldsError = useCallback(() => {
    const errors: Record<string, string[]> = {}
    fieldsRef.current.forEach((field, name) => {
      if (field.errors && field.errors.length > 0) {
        errors[name] = field.errors
      }
    })
    return errors
  }, [])

  // 验证单个字段
  const validateField = useCallback(
    async (name: string, rules?: Rule[]): Promise<boolean> => {
      const fieldRules = rules || fieldRulesRef.current.get(name) || []
      const value = formValues[name]

      const errors = await validateValue(value, fieldRules, formValues)

      const field = fieldsRef.current.get(name)
      if (field) {
        field.errors = errors
        field.touched = true
      }

      // 触发重新渲染
      forceUpdate({})

      return errors.length === 0
    },
    [formValues]
  )

  // 验证所有字段
  const validateFields = useCallback(async (): Promise<boolean> => {
    let isValid = true

    // 验证所有已注册的字段
    for (const [name, rules] of fieldRulesRef.current.entries()) {
      const fieldIsValid = await validateField(name, rules)
      if (!fieldIsValid) {
        isValid = false
      }
    }

    return isValid
  }, [validateField])

  // 提交表单
  const submit = useCallback(() => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }, [])

  // 重置表单
  const resetFields = useCallback(() => {
    const resetValues = { ...initialValues }

    if (!isControlled) {
      setInternalValues(resetValues)
    }

    // 重置所有字段
    fieldsRef.current.forEach((field, name) => {
      field.value = resetValues[name]
      field.errors = []
      field.touched = false
    })

    // 触发重新渲染
    forceUpdate({})

    onValuesChange?.({}, resetValues)
  }, [initialValues, isControlled, onValuesChange])

  // 设置多个字段值
  const setFieldsValue = useCallback(
    (values: Record<string, any>) => {
      const newValues = { ...formValues, ...values }

      if (!isControlled) {
        setInternalValues(newValues)
      }

      // 更新字段数据
      Object.keys(values).forEach(name => {
        const field = fieldsRef.current.get(name)
        if (field) {
          field.value = values[name]
          field.touched = true
        }
      })

      onValuesChange?.(values, newValues)
    },
    [formValues, isControlled, onValuesChange]
  )

  // 如果外部传入了 form，立即更新其方法（使用 ref 函数避免闭包问题）
  const updateFormInstance = useCallback(() => {
    if (externalForm) {
      externalForm.getFieldsValue = getFieldsValue
      externalForm.getFieldValue = getFieldValue
      externalForm.setFieldValue = setFieldValue
      externalForm.setFieldsValue = setFieldsValue
      externalForm.resetFields = resetFields
      externalForm.validateFields = validateFields
      externalForm.validateField = (name: string) => validateField(name)
      externalForm.getFieldError = getFieldError
      externalForm.getFieldsError = getFieldsError
      externalForm.submit = submit
    }
  }, [
    getFieldsValue,
    getFieldValue,
    setFieldValue,
    setFieldsValue,
    resetFields,
    validateFields,
    validateField,
    getFieldError,
    getFieldsError,
    submit
  ])

  // 每次渲染时都更新 form 实例的方法
  updateFormInstance()

  // 处理表单提交
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const isValid = await validateFields()

      if (isValid) {
        onFinish?.(formValues)
      } else {
        const errors = getFieldsError()
        onFinishFailed?.(errors)
      }
    },
    [formValues, validateFields, onFinish, onFinishFailed, getFieldsError]
  )

  // Context 值
  const contextValue: FormContextValue = useMemo(
    () => ({
      size,
      layout,
      labelWidth,
      labelAlign,
      disabled,
      values: formValues,
      fields: fieldsRef.current,
      setFieldValue,
      getFieldValue,
      getFieldsValue,
      getFieldError,
      validateField,
      validateFields,
      resetFields,
      setFieldsValue,
      registerField,
      unregisterField,
      registerFieldRules
    }),
    [
      size,
      layout,
      labelWidth,
      labelAlign,
      disabled,
      formValues,
      setFieldValue,
      getFieldValue,
      getFieldsValue,
      getFieldError,
      validateField,
      validateFields,
      resetFields,
      setFieldsValue,
      registerField,
      unregisterField,
      registerFieldRules
    ]
  )

  const formClasses = classNames(
    styles.form,
    styles[`form--${layout}`],
    styles[`form--${size}`],
    className
  )

  return (
    <FormContext.Provider value={contextValue}>
      <form ref={formRef} className={formClasses} style={style} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

// Form.useForm hook - 创建一个空的 FormInstance，实际方法会在 Form 组件中填充
Form.useForm = (): [FormInstance] => {
  const formRef = useRef<any>({
    getFieldsValue: () => ({}),
    getFieldValue: () => undefined,
    setFieldValue: () => {},
    setFieldsValue: () => {},
    resetFields: () => {},
    validateFields: async () => true,
    validateField: async () => true,
    getFieldError: () => [],
    getFieldsError: () => ({}),
    submit: () => {}
  })
  return [formRef.current] as [FormInstance]
}
