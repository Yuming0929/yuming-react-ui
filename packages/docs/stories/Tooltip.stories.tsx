import type { Meta, StoryObj } from '@storybook/react'
import { Button, Tooltip } from '@yuming/ui'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tooltip 用于显示提示信息。'
      }
    }
  }
}

export default meta

export const Basic: StoryObj = {
  render: () => (
    <Tooltip title="这是一条提示信息">
      <Button>显示提示</Button>
    </Tooltip>
  )
}
// 上下左右位置
export const Placement: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Tooltip title="这是一条提示信息" placement="top">
        <Button>上</Button>
      </Tooltip>
      <Tooltip title="这是一条提示信息" placement="right">
        <Button>右</Button>
      </Tooltip>
      <Tooltip title="这是一条提示信息" placement="bottom">
        <Button>下</Button>
      </Tooltip>
      <Tooltip title="这是一条提示信息" placement="left">
        <Button>左</Button>
      </Tooltip>
    </div>
  )
}
