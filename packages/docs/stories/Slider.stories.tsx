import React from 'react'
import { Slider } from '@yuming/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Slider 用于选择一个数值。支持键盘操作、标记点、垂直方向等功能。'
      }
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Slider>

// 基础滑块
export const Default: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    formatTooltip: value => `${value}%`,
    style: { width: '300px' }
  }
}

// 受控模式
const ControlledComponent = () => {
  const [value, setValue] = React.useState(30)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Slider value={value} onChange={setValue} formatTooltip={v => `${v}%`} />
      <div>当前值: {value}</div>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledComponent />
}

// 带标记点
export const WithMarks: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 10,
    marks: {
      0: '0°C',
      25: '25°C',
      50: '50°C',
      75: '75°C',
      100: '100°C'
    },
    formatTooltip: value => `${value}°C`,
    style: { width: '400px' }
  }
}

// 点状标记
export const WithDots: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 10,
    dots: true,
    formatTooltip: value => `${value}%`,
    style: { width: '300px' }
  }
}

// 垂直方向
export const Vertical: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    vertical: true,
    formatTooltip: value => `${value}%`,
    style: { height: '300px' }
  }
}

// 不同步长
export const Steps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '300px' }}>
      <div>
        <h3>步长: 1</h3>
        <Slider defaultValue={50} step={1} formatTooltip={v => `${v}`} />
      </div>
      <div>
        <h3>步长: 5</h3>
        <Slider defaultValue={50} step={5} formatTooltip={v => `${v}`} />
      </div>
      <div>
        <h3>步长: 10</h3>
        <Slider defaultValue={50} step={10} formatTooltip={v => `${v}`} />
      </div>
    </div>
  )
}

// 禁用状态
export const Disabled: Story = {
  args: {
    defaultValue: 50,
    disabled: true,
    formatTooltip: value => `${value}%`,
    style: { width: '300px' }
  }
}

// 自定义格式化
export const CustomFormat: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    formatTooltip: value => `$${value.toFixed(2)}`,
    style: { width: '300px' }
  }
}

// 回调示例
const WithCallbacksComponent = () => {
  const [changeValue, setChangeValue] = React.useState(50)
  const [afterChangeValue, setAfterChangeValue] = React.useState(50)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Slider
        defaultValue={50}
        onChange={v => {
          console.log('onChange:', v)
          setChangeValue(v)
        }}
        onAfterChange={v => {
          console.log('onAfterChange:', v)
          setAfterChangeValue(v)
        }}
        formatTooltip={v => `${v}%`}
      />
      <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div>onChange 值: {changeValue}</div>
        <div>onAfterChange 值: {afterChangeValue}</div>
      </div>
    </div>
  )
}

export const WithCallbacks: Story = {
  render: () => <WithCallbacksComponent />
}
