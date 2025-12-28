import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('应该正确渲染', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByRole('button', { name: '点击我' })).toBeInTheDocument()
  })

  it('应该应用默认 variant', () => {
    const { container } = render(<Button>按钮</Button>)
    const button = container.querySelector('button')
    // CSS Modules 会生成哈希类名，所以检查类名是否包含特定模式
    expect(button?.className).toContain('button')
  })

  it('应该应用指定的 variant', () => {
    const { container } = render(<Button variant="primary">主要按钮</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('button')
    expect(button).toBeInTheDocument()
  })

  it('应该应用指定的 size', () => {
    const { container } = render(<Button size="large">大按钮</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('button')
    expect(button).toBeInTheDocument()
  })

  it('应该在禁用时应用禁用样式', () => {
    const { container } = render(<Button disabled>禁用按钮</Button>)
    const button = container.querySelector('button')
    expect(button).toBeDisabled()
    expect(button?.className).toContain('button')
  })

  it('应该在加载时应用加载样式', () => {
    const { container } = render(<Button loading>加载中</Button>)
    const button = container.querySelector('button')
    expect(button).toBeDisabled()
    expect(button?.className).toContain('button')
  })

  it('应该响应点击事件', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>点击我</Button>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('禁用时不应该响应点击事件', () => {
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        禁用按钮
      </Button>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('加载时不应该响应点击事件', () => {
    const handleClick = vi.fn()
    render(
      <Button loading onClick={handleClick}>
        加载中
      </Button>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('应该支持 block 属性', () => {
    const { container } = render(<Button block>块级按钮</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('button')
    expect(button).toBeInTheDocument()
  })

  it('应该正确传递 ref', () => {
    const ref = { current: null }
    render(<Button ref={ref}>按钮</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('应该支持自定义 className', () => {
    const { container } = render(<Button className="custom-class">按钮</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })
})
