import { Rule } from './type'

export const validateValue = async (
  value: any,
  rules: Rule[] = [],
  formValues: Record<string, any> = {}
): Promise<string[]> => {
  const errors: string[] = []

  for (const rule of rules) {
    // 必填验证
    if (rule.required) {
      if (value === undefined || value === null || value === '') {
        errors.push(rule.message || '此字段为必填项')
        continue
      }
    }

    // 如果值为空且不是必填，跳过其他验证
    if (value === undefined || value === null || value === '') {
      continue
    }

    // 类型验证
    if (rule.type) {
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(rule.message || '必须是字符串')
          } else {
            // 字符串长度验证
            if (rule.min !== undefined && value.length < rule.min) {
              errors.push(rule.message || `长度不能少于 ${rule.min} 个字符`)
            }
            if (rule.max !== undefined && value.length > rule.max) {
              errors.push(rule.message || `长度不能超过 ${rule.max} 个字符`)
            }
          }
          break
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            errors.push(rule.message || '必须是数字')
          } else {
            if (rule.min !== undefined && value < rule.min) {
              errors.push(rule.message || `不能小于 ${rule.min}`)
            }
            if (rule.max !== undefined && value > rule.max) {
              errors.push(rule.message || `不能大于 ${rule.max}`)
            }
          }
          break
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(rule.message || '必须是布尔值')
          }
          break
        case 'email': {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailPattern.test(String(value))) {
            errors.push(rule.message || '请输入有效的邮箱地址')
          }
          break
        }
        case 'url':
          try {
            new URL(String(value))
          } catch {
            errors.push(rule.message || '请输入有效的 URL')
          }
          break
      }
    }

    // 正则验证
    if (rule.pattern && !rule.pattern.test(String(value))) {
      errors.push(rule.message || '格式不正确')
    }

    // 自定义验证
    if (rule.validator) {
      try {
        await rule.validator(value, formValues)
      } catch (error) {
        errors.push(error instanceof Error ? error.message : rule.message || '验证失败')
      }
    }
  }

  return errors
}
