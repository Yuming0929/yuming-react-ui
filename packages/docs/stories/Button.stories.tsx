import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@yuming/ui'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '按钮用于触发一个操作。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error'],
      description: '按钮类型'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '按钮尺寸'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    loading: {
      control: 'boolean',
      description: '是否加载中'
    },
    block: {
      control: 'boolean',
      description: '是否块级按钮'
    }
  }
}

export default meta
type Story = StoryObj<typeof Button>

// 默认按钮
export const Default: Story = {
  args: {
    children: '默认按钮'
  }
}

// 主要按钮
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮'
  }
}

// 成功按钮
export const Success: Story = {
  args: {
    variant: 'success',
    children: '成功按钮'
  }
}

// 警告按钮
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: '警告按钮'
  }
}

// 错误按钮
export const Error: Story = {
  args: {
    variant: 'error',
    children: '错误按钮'
  }
}

// 尺寸
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="small">小按钮</Button>
      <Button size="medium">中按钮</Button>
      <Button size="large">大按钮</Button>
    </div>
  )
}

// 禁用状态
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button disabled>禁用按钮</Button>
      <Button variant="primary" disabled>
        禁用主要按钮
      </Button>
    </div>
  )
}

// 加载状态
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button loading>加载中</Button>
      <Button variant="primary" loading>
        加载中
      </Button>
    </div>
  )
}

// 块级按钮
export const Block: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Button block>块级按钮</Button>
    </div>
  )
}

