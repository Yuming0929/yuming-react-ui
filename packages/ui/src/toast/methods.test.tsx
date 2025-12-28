import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { toast } from './methods'

describe('toast methods', () => {
  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // 清理所有 Toast
    document.body.innerHTML = ''
    vi.clearAllTimers()
  })

  it('toast.success 应该被调用', () => {
    expect(() => toast.success('成功消息')).not.toThrow()
  })

  it('toast.error 应该被调用', () => {
    expect(() => toast.error('错误消息')).not.toThrow()
  })

  it('toast.warning 应该被调用', () => {
    expect(() => toast.warning('警告消息')).not.toThrow()
  })

  it('toast.info 应该被调用', () => {
    expect(() => toast.info('信息')).not.toThrow()
  })

  it('toast.loading 应该被调用', () => {
    expect(() => toast.loading('加载中')).not.toThrow()
  })

  it('应该支持自定义 duration', () => {
    expect(() => toast.info('消息', { duration: 5000 })).not.toThrow()
  })

  it('应该支持自定义内容', () => {
    expect(() => toast.success(<div>自定义内容</div>)).not.toThrow()
  })
})
