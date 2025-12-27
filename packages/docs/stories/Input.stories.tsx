import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@yuming/ui'
import { Search, Check, User, Lock, DollarSign } from 'lucide-react'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '输入框用于接收用户输入。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '输入框尺寸'
    },
    status: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: '输入框状态'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    readOnly: {
      control: 'boolean',
      description: '是否只读'
    },
    allowClear: {
      control: 'boolean',
      description: '是否显示清除按钮'
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'number', 'email', 'search'],
      description: '输入框类型'
    }
  }
}

export default meta
type Story = StoryObj<typeof Input>

// 默认输入框
export const Default: Story = {
  args: {
    placeholder: '请输入内容'
  }
}

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input size="small" placeholder="小尺寸输入框" />
      <Input size="medium" placeholder="中尺寸输入框" />
      <Input size="large" placeholder="大尺寸输入框" />
    </div>
  )
}

// 不同状态
export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input status="default" placeholder="默认状态" />
      <Input status="success" placeholder="成功状态" />
      <Input status="warning" placeholder="警告状态" />
      <Input status="error" placeholder="错误状态" />
    </div>
  )
}

// 禁用和只读
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input disabled placeholder="禁用状态" />
      <Input readOnly value="只读状态" />
    </div>
  )
}

// 清除按钮
export const AllowClear: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input allowClear placeholder="带清除按钮" defaultValue="可清除的内容" />
    </div>
  )
}

// 密码输入框
export const Password: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input type="password" placeholder="请输入密码" />
      <Input type="password" allowClear placeholder="密码（可清除）" />
    </div>
  )
}

// 前后缀图标
export const WithPrefixSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input prefix={<Search size={16} />} placeholder="带前缀图标" />
      <Input suffix={<Check size={16} />} placeholder="带后缀图标" />
      <Input prefix={<DollarSign size={16} />} suffix="元" placeholder="前后缀都有" />
    </div>
  )
}

// 前后缀标签
export const WithAddon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input addonBefore="https://" placeholder="example.com" />
      <Input addonAfter=".com" placeholder="example" />
      <Input addonBefore="http://" addonAfter=".com" placeholder="example" />
    </div>
  )
}

// 组合示例
export const Combined: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <Input
        size="large"
        prefix={<User size={16} />}
        placeholder="用户名"
        allowClear
      />
      <Input
        type="password"
        size="large"
        prefix={<Lock size={16} />}
        placeholder="密码"
      />
      <Input
        status="success"
        prefix={<DollarSign size={16} />}
        suffix="元"
        placeholder="金额"
        allowClear
      />
    </div>
  )
}
