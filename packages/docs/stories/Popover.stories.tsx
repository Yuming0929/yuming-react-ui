import { Button, Popover } from '@yuming/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Popover 用于显示提示信息。'
      }
    }
  }
}

export default meta

export const Basic: StoryObj = {
  render: () => (
    <Popover title="这是一条提示信息" content="这是一条提示信息" placement="top" showClose={true}>
      <Button>显示提示</Button>
    </Popover>
  )
}
