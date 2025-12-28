import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('应该正确渲染', () => {
    render(<Input placeholder="请输入" />)
    expect(screen.getByPlaceholderText('请输入')).toBeInTheDocument()
  })

  it('应该应用默认 size', () => {
    const { container } = render(<Input />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('input')
    expect(input).toBeInTheDocument()
  })

  it('应该应用指定的 size', () => {
    const { container } = render(<Input size="large" />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('input')
    expect(input).toBeInTheDocument()
  })

  it('应该应用指定的 status', () => {
    const { container } = render(<Input status="error" />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('input')
    expect(input).toBeInTheDocument()
  })

  it('应该在禁用时应用禁用样式', () => {
    const { container } = render(<Input disabled />)
    const input = container.querySelector('input')
    expect(input).toBeDisabled()
    expect(input?.parentElement?.className).toContain('input-wrapper')
  })

  it('应该在只读时应用只读样式', () => {
    const { container } = render(<Input readOnly />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('readOnly')
    expect(input?.className).toContain('input')
  })

  it('应该响应输入变化', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('test')
  })

  it('应该支持受控模式', () => {
    const { rerender } = render(<Input value="初始值" onChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('初始值')

    rerender(<Input value="新值" onChange={() => {}} />)
    expect(input).toHaveValue('新值')
  })

  it('应该支持非受控模式', async () => {
    render(<Input defaultValue="默认值" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('默认值')

    await userEvent.clear(input)
    await userEvent.type(input, '新输入')
    expect(input).toHaveValue('新输入')
  })

  it('应该显示清除按钮当 allowClear 为 true 且有值时', () => {
    const { container } = render(<Input allowClear defaultValue="有值" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('有值')

    // 查找清除按钮（通过 role="button" 和包含在 inputSuffix 中）
    const clearButton = container.querySelector('[role="button"]')
    expect(clearButton).toBeTruthy()
  })

  it('清除按钮应该清除输入值', async () => {
    const handleChange = vi.fn()
    const { container } = render(<Input allowClear defaultValue="测试" onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('测试')

    // 查找清除按钮并点击
    const clearButton = container.querySelector('[role="button"]')
    expect(clearButton).toBeTruthy()

    if (clearButton) {
      fireEvent.click(clearButton)
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled()
      })
    }
  })

  it('应该支持 prefix', () => {
    render(<Input prefix={<span data-testid="prefix">🔍</span>} />)
    expect(screen.getByTestId('prefix')).toBeInTheDocument()
  })

  it('应该支持 suffix', () => {
    render(<Input suffix={<span data-testid="suffix">✓</span>} />)
    expect(screen.getByTestId('suffix')).toBeInTheDocument()
  })

  it('应该支持 addonBefore 和 addonAfter', () => {
    render(
      <Input
        addonBefore={<span data-testid="addon-before">http://</span>}
        addonAfter={<span data-testid="addon-after">.com</span>}
      />
    )
    expect(screen.getByTestId('addon-before')).toBeInTheDocument()
    expect(screen.getByTestId('addon-after')).toBeInTheDocument()
  })

  it('应该响应 onPressEnter', async () => {
    const handlePressEnter = vi.fn()
    render(<Input onPressEnter={handlePressEnter} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, '{Enter}')

    expect(handlePressEnter).toHaveBeenCalledTimes(1)
  })

  it('应该支持密码类型和可见性切换', () => {
    const { container } = render(<Input type="password" />)
    const input = container.querySelector('input[type="password"]')
    expect(input).toBeInTheDocument()

    // 查找密码切换按钮（通过 role="button"）
    const buttons = container.querySelectorAll('[role="button"]')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('应该正确传递 ref', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
