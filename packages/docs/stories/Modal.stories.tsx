import { Button } from '@yuming/ui'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from '@yuming/ui'
import { useState } from 'react'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '模态框用于显示重要信息或请求用户操作。'
      }
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Modal>

// 基础用法
const BasicComponent = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>打开模态框</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal"
        children={<div>模态框内容</div>}
      />
    </>
  )
}

export const Basic: Story = {
  render: () => <BasicComponent />
}
