import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Form, FormItem, Input, Button, Select } from '@yuming/ui'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '表单组件，用于数据录入、校验和提交。'
      }
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Form>

// 基础表单
export const Basic: Story = {
  render: () => (
    <Form
      onFinish={values => {
        console.log('提交成功:', values)
        alert(JSON.stringify(values, null, 2))
      }}
      onFinishFailed={errors => {
        console.log('验证失败:', errors)
      }}
    >
      <FormItem label="用户名" name="username" required>
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem
        label="邮箱"
        name="email"
        rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
      >
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem>
        <Button type="submit" variant="primary">
          提交
        </Button>
      </FormItem>
    </Form>
  )
}

// 使用 Form.useForm
const UseFormComponent = () => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const isValid = await form.validateFields()
    if (isValid) {
      const values = form.getFieldsValue()
      console.log('表单值:', values)
      alert(JSON.stringify(values, null, 2))
    }
  }

  const handleReset = () => {
    form.resetFields()
  }

  const handleSetValues = () => {
    form.setFieldsValue({
      username: '张三',
      email: 'zhangsan@example.com'
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Form form={form}>
        <FormItem label="用户名" name="username" required>
          <Input placeholder="请输入用户名" />
        </FormItem>
        <FormItem
          label="邮箱"
          name="email"
          rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
        >
          <Input placeholder="请输入邮箱" />
        </FormItem>
        <FormItem>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="button" variant="primary" onClick={handleSubmit}>
              提交
            </Button>
            <Button type="button" onClick={handleReset}>
              重置
            </Button>
            <Button type="button" onClick={handleSetValues}>
              填充数据
            </Button>
          </div>
        </FormItem>
      </Form>
    </div>
  )
}

export const UseForm: Story = {
  render: () => <UseFormComponent />
}

// 验证规则
export const Validation: Story = {
  render: () => (
    <Form
      onFinish={values => {
        console.log('提交成功:', values)
        alert(JSON.stringify(values, null, 2))
      }}
    >
      <FormItem
        label="用户名"
        name="username"
        required
        rules={[
          { min: 3, message: '用户名至少3个字符' },
          { max: 20, message: '用户名最多20个字符' }
        ]}
      >
        <Input placeholder="请输入用户名（3-20个字符）" />
      </FormItem>
      <FormItem
        label="密码"
        name="password"
        required
        rules={[
          { min: 6, message: '密码至少6个字符' },
          { pattern: /^(?=.*[A-Za-z])(?=.*\d)/, message: '密码必须包含字母和数字' }
        ]}
      >
        <Input type="password" placeholder="请输入密码" />
      </FormItem>
      <FormItem
        label="邮箱"
        name="email"
        rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
      >
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem>
        <Button type="submit" variant="primary">
          提交
        </Button>
      </FormItem>
    </Form>
  )
}

// 自定义验证
export const CustomValidator: Story = {
  render: () => (
    <Form
      onFinish={values => {
        console.log('提交成功:', values)
        alert(JSON.stringify(values, null, 2))
      }}
    >
      <FormItem
        label="确认密码"
        name="confirmPassword"
        required
        rules={[
          {
            validator: async (value, formValues) => {
              if (!value) {
                throw new Error('请确认密码')
              }
              if (value !== formValues?.password) {
                throw new Error('两次输入的密码不一致')
              }
            }
          }
        ]}
      >
        <Input type="password" placeholder="请再次输入密码" />
      </FormItem>
      <FormItem label="密码" name="password" required>
        <Input type="password" placeholder="请输入密码" />
      </FormItem>
      <FormItem>
        <Button type="submit" variant="primary">
          提交
        </Button>
      </FormItem>
    </Form>
  )
}

// 水平布局
export const HorizontalLayout: Story = {
  render: () => (
    <Form layout="horizontal" labelWidth={100}>
      <FormItem label="用户名" name="username" required>
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem
        label="邮箱"
        name="email"
        rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
      >
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="">
        <Button type="submit" variant="primary">
          提交
        </Button>
      </FormItem>
    </Form>
  )
}

// 内联布局
export const InlineLayout: Story = {
  render: () => (
    <Form layout="inline">
      <FormItem label="用户名" name="username">
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="邮箱" name="email">
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem>
        <Button type="submit" variant="primary">
          搜索
        </Button>
      </FormItem>
    </Form>
  )
}

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3>小尺寸</h3>
        <Form size="small">
          <FormItem label="用户名" name="username">
            <Input placeholder="请输入用户名" />
          </FormItem>
          <FormItem>
            <Button type="submit" variant="primary" size="small">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <h3>中等尺寸（默认）</h3>
        <Form size="medium">
          <FormItem label="用户名" name="username">
            <Input placeholder="请输入用户名" />
          </FormItem>
          <FormItem>
            <Button type="submit" variant="primary">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <h3>大尺寸</h3>
        <Form size="large">
          <FormItem label="用户名" name="username">
            <Input placeholder="请输入用户名" />
          </FormItem>
          <FormItem>
            <Button type="submit" variant="primary" size="large">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

// 受控模式
const ControlledComponent = () => {
  const [formValues, setFormValues] = useState({
    username: '',
    email: ''
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Form
        values={formValues}
        onValuesChange={(changedValues, allValues) => {
          console.log('值变化:', changedValues)
          setFormValues(allValues as { username: string; email: string })
        }}
        onFinish={values => {
          console.log('提交成功:', values)
          alert(JSON.stringify(values, null, 2))
        }}
      >
        <FormItem label="用户名" name="username" required>
          <Input placeholder="请输入用户名" />
        </FormItem>
        <FormItem
          label="邮箱"
          name="email"
          rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
        >
          <Input placeholder="请输入邮箱" />
        </FormItem>
        <FormItem>
          <Button type="submit" variant="primary">
            提交
          </Button>
        </FormItem>
      </Form>
      <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
        <strong>当前表单值：</strong>
        <pre>{JSON.stringify(formValues, null, 2)}</pre>
      </div>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledComponent />
}

// 初始值
export const InitialValues: Story = {
  render: () => (
    <Form
      initialValues={{
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        city: 'beijing'
      }}
      onFinish={values => {
        console.log('提交成功:', values)
        alert(JSON.stringify(values, null, 2))
      }}
    >
      <FormItem label="用户名" name="username" required>
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem
        label="邮箱"
        name="email"
        rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
      >
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="城市" name="city">
        <Input placeholder="请输入城市" />
      </FormItem>
      <FormItem>
        <Button type="submit" variant="primary">
          提交
        </Button>
      </FormItem>
    </Form>
  )
}

// 复杂表单
export const Complex: Story = {
  render: () => (
    <Form
      layout="horizontal"
      labelWidth={120}
      onFinish={values => {
        console.log('提交成功:', values)
        alert(JSON.stringify(values, null, 2))
      }}
    >
      <FormItem label="用户名" name="username" required>
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem
        label="邮箱"
        name="email"
        required
        rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
      >
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="城市" name="city">
        <Select
          placeholder="请选择城市"
          options={[
            { value: 'beijing', label: '北京' },
            { value: 'shanghai', label: '上海' },
            { value: 'guangzhou', label: '广州' },
            { value: 'shenzhen', label: '深圳' }
          ]}
        />
      </FormItem>
      <FormItem label="备注" name="remark" help="这是帮助文本">
        <Input placeholder="请输入备注" />
      </FormItem>
      <FormItem label="">
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="submit" variant="primary">
            提交
          </Button>
          <Button type="button">取消</Button>
        </div>
      </FormItem>
    </Form>
  )
}

// 禁用状态
export const Disabled: Story = {
  render: () => (
    <Form disabled>
      <FormItem label="用户名" name="username">
        <Input placeholder="请输入用户名" defaultValue="zhangsan" />
      </FormItem>
      <FormItem label="邮箱" name="email">
        <Input placeholder="请输入邮箱" defaultValue="zhangsan@example.com" />
      </FormItem>
      <FormItem>
        <Button type="submit" variant="primary" disabled>
          提交
        </Button>
      </FormItem>
    </Form>
  )
}

// 帮助文本和额外信息
export const HelpAndExtra: Story = {
  render: () => (
    <Form>
      <FormItem
        label="用户名"
        name="username"
        required
        help="用户名长度为3-20个字符"
        extra="这是额外提示信息"
      >
        <Input placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="邮箱" name="email" help="我们将使用此邮箱发送验证邮件">
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem>
        <Button type="submit" variant="primary">
          提交
        </Button>
      </FormItem>
    </Form>
  )
}
