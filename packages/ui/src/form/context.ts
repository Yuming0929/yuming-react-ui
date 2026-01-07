import { createContext } from 'react'
import { FormSize, FormLayout, Rule, FieldData } from './type'

export interface FormContextValue {
  size: FormSize
  layout: FormLayout
  labelWidth?: number | string
  labelAlign: 'left' | 'right'
  disabled: boolean
  values: Record<string, any>
  fields: Map<string, FieldData>
  setFieldValue: (name: string, value: any) => void
  getFieldValue: (name: string) => any
  getFieldsValue: (nameList?: string[]) => Record<string, any>
  getFieldError: (name: string) => string[]
  validateField: (name: string, rules?: Rule[]) => Promise<boolean>
  validateFields: () => Promise<boolean>
  resetFields: () => void
  setFieldsValue: (values: Record<string, any>) => void
  registerField: (name: string) => void
  unregisterField: (name: string) => void
  registerFieldRules: (name: string, rules: Rule[]) => void
}

export const FormContext = createContext<FormContextValue | null>(null)
