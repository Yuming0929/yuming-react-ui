import { Button, Select } from '@yuming/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Select 用于选择一个或多个选项。'
      }
    }
  }
}

export default meta

export const Basic: StoryObj = {
  render: () => (
    <Select
      options={[
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' }
      ]}
    />
  )
}
// long list
export const LongList: StoryObj = {
  render: () => (
    <Select
      options={Array.from({ length: 100 }, (_, index) => ({ value: index, label: `选项${index}` }))}
    />
  )
}

export const Multiple: StoryObj = {
  render: () => (
    <div style={{ width: '200px', height: '300px', backgroundColor: 'red' }}>
      <Select
        options={Array.from({ length: 10 }, (_, index) => ({
          value: index,
          label: `选项${index}`
        }))}
        multiple
      />
      container
    </div>
  )
}

export const Disabled: StoryObj = {
  render: () => (
    <Select
      options={[
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' }
      ]}
      disabled
    />
  )
}

export const Searchable: StoryObj = {
  render: () => (
    <Select
      options={[
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' }
      ]}
      searchable
    />
  )
}

export const AllowClear: StoryObj = {
  render: () => (
    <Select
      options={[
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' }
      ]}
      allowClear
    />
  )
}

export const Loading: StoryObj = {
  render: () => {
    let loading = false
    return (
      <>
        <Button onClick={() => (loading = !loading)}>切换加载状态</Button>
        <Select
          options={Array.from({ length: 100 }, (_, index) => ({
            value: index,
            label: `选项${index}`
          }))}
          loading={loading}
        />
      </>
    )
  }
}
