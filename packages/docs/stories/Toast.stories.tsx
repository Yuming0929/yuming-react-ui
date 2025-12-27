import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@yuming/ui'
import { toast } from '@yuming/ui'

const meta: Meta = {
  title: 'Components/Toast',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toast 用于显示全局提示信息，支持成功、错误、警告、信息和加载等多种类型。'
      }
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj

// 基础用法
export const Basic: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button onClick={() => toast.info('这是一条提示信息')}>
        显示提示
      </Button>
    </div>
  )
}

// 成功提示
export const Success: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button
        variant="success"
        onClick={() => toast.success('操作成功！')}
      >
        成功提示
      </Button>
      <Button
        variant="success"
        onClick={() => toast.success('数据已保存', { duration: 5000 })}
      >
        自定义时长
      </Button>
    </div>
  )
}

// 错误提示
export const Error: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button
        variant="error"
        onClick={() => toast.error('操作失败，请重试')}
      >
        错误提示
      </Button>
      <Button
        variant="error"
        onClick={() => toast.error('网络连接失败，请检查网络设置', { duration: 6000 })}
      >
        长文本错误
      </Button>
    </div>
  )
}

// 警告提示
export const Warning: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button
        variant="warning"
        onClick={() => toast.warning('请注意：此操作不可撤销')}
      >
        警告提示
      </Button>
      <Button
        variant="warning"
        onClick={() => toast.warning('您的账户余额不足', { duration: 5000 })}
      >
        余额警告
      </Button>
    </div>
  )
}

// 信息提示
export const Info: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button onClick={() => toast.info('这是一条信息提示')}>
        信息提示
      </Button>
      <Button onClick={() => toast.info('新消息：您有 3 条未读消息', { duration: 4000 })}>
        新消息提示
      </Button>
    </div>
  )
}

// 加载提示
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button
        onClick={() => {
          toast.loading('正在加载...')
          // 模拟异步操作
          setTimeout(() => {
            toast.success('加载完成')
          }, 2000)
        }}
      >
        加载提示
      </Button>
      <Button
        onClick={() => {
          toast.loading('正在处理中...', { duration: 0 })
          setTimeout(() => {
            toast.success('处理完成')
          }, 3000)
        }}
      >
        长时间加载
      </Button>
    </div>
  )
}

// 所有类型
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button variant="success" onClick={() => toast.success('成功提示')}>
        成功
      </Button>
      <Button variant="error" onClick={() => toast.error('错误提示')}>
        错误
      </Button>
      <Button variant="warning" onClick={() => toast.warning('警告提示')}>
        警告
      </Button>
      <Button onClick={() => toast.info('信息提示')}>
        信息
      </Button>
      <Button onClick={() => toast.loading('加载中...')}>
        加载
      </Button>
    </div>
  )
}

// 自定义内容
export const CustomContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '250px' }}>
      <Button
        onClick={() =>
          toast.success(
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>操作成功</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                您的数据已成功保存到服务器
              </div>
            </div>
          )
        }
      >
        自定义内容
      </Button>
      <Button
        onClick={() =>
          toast.info(
            <div>
              <span style={{ fontWeight: 'bold' }}>提示：</span>
              <span>这是一个包含 HTML 内容的提示</span>
            </div>
          )
        }
      >
        富文本内容
      </Button>
    </div>
  )
}

// 连续提示
export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button
        onClick={() => {
          toast.info('第一条提示')
          setTimeout(() => toast.success('第二条提示'), 300)
          setTimeout(() => toast.warning('第三条提示'), 600)
        }}
      >
        连续显示多个
      </Button>
      <Button
        onClick={() => {
          for (let i = 1; i <= 5; i++) {
            setTimeout(() => {
              toast.info(`提示 ${i}`)
            }, i * 200)
          }
        }}
      >
        快速连续显示
      </Button>
    </div>
  )
}

// 不同时长
export const Durations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      <Button onClick={() => toast.info('1秒后关闭', { duration: 1000 })}>
        1秒
      </Button>
      <Button onClick={() => toast.info('3秒后关闭（默认）', { duration: 3000 })}>
        3秒（默认）
      </Button>
      <Button onClick={() => toast.info('5秒后关闭', { duration: 5000 })}>
        5秒
      </Button>
      <Button onClick={() => toast.loading('不会自动关闭', { duration: 0 })}>
        不自动关闭
      </Button>
    </div>
  )
}

// 实际场景示例
export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '250px' }}>
      <Button
        onClick={() => {
          toast.loading('正在保存...')
          setTimeout(() => {
            toast.success('保存成功！')
          }, 1500)
        }}
      >
        保存操作
      </Button>
      <Button
        onClick={() => {
          toast.loading('正在删除...')
          setTimeout(() => {
            toast.error('删除失败，请重试')
          }, 1500)
        }}
      >
        删除操作
      </Button>
      <Button
        onClick={() => {
          toast.warning('确定要执行此操作吗？')
        }}
      >
        确认提示
      </Button>
      <Button
        onClick={() => {
          toast.info('已复制到剪贴板')
        }}
      >
        复制提示
      </Button>
    </div>
  )
}
