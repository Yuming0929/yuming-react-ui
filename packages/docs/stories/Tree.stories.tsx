import type { Meta, StoryObj } from '@storybook/react'
import { Tree } from '@yuming/ui'
import type { TreeProps } from '@yuming/ui'

type TreeNodeType = TreeProps['treeData'][number]

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '树形组件，用于展示层级结构数据。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: '是否支持多选'
    },
    defaultExpandAll: {
      control: 'boolean',
      description: '默认是否展开所有节点'
    }
  }
}

export default meta
type Story = StoryObj<typeof Tree>

// 示例数据
const treeData: TreeNodeType[] = [
  {
    key: '1',
    title: '一级节点 1',
    children: [
      {
        key: '1-1',
        title: '二级节点 1-1',
        children: [
          { key: '1-1-1', title: '三级节点 1-1-1' },
          { key: '1-1-2', title: '三级节点 1-1-2' }
        ]
      },
      { key: '1-2', title: '二级节点 1-2' }
    ]
  },
  {
    key: '2',
    title: '一级节点 2',
    children: [
      { key: '2-1', title: '二级节点 2-1' },
      { key: '2-2', title: '二级节点 2-2' }
    ]
  },
  {
    key: '3',
    title: '一级节点 3'
  }
]

const updateTreeData = (
  list: TreeNodeType[],
  key: React.Key,
  children: TreeNodeType[]
): TreeNodeType[] =>
  list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children
      }
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      }
    }
    return node
  })

const onLoadData = (node: TreeNodeType) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve(void 0)
    }, 1000)
  })
}

// 默认树
export const Default: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Tree treeData={treeData} />
    </div>
  )
}

// 默认展开所有
export const DefaultExpandAll: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Tree treeData={treeData} defaultExpandAll />
    </div>
  )
}

// 默认展开指定节点
export const DefaultExpandedKeys: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Tree treeData={treeData} defaultExpandedKeys={['1', '2']} />
    </div>
  )
}

// 多选
export const Multiple: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Tree treeData={treeData} multiple />
    </div>
  )
}

// 禁用节点
export const Disabled: Story = {
  render: () => {
    const dataWithDisabled: TreeNodeType[] = [
      {
        key: '1',
        title: '一级节点 1',
        children: [
          {
            key: '1-1',
            title: '二级节点 1-1（禁用）',
            disabled: true,
            children: [{ key: '1-1-1', title: '三级节点 1-1-1' }]
          },
          { key: '1-2', title: '二级节点 1-2' }
        ]
      },
      {
        key: '2',
        title: '一级节点 2（禁用）',
        disabled: true
      }
    ]
    return (
      <div style={{ width: '300px' }}>
        <Tree treeData={dataWithDisabled} />
      </div>
    )
  }
}

// 带回调
export const WithCallbacks: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Tree
        treeData={treeData}
        onSelect={(selectedKeys, node) => {
          console.log('选中:', selectedKeys, node)
        }}
        onExpand={(expandedKeys, node) => {
          console.log('展开:', expandedKeys, node)
        }}
      />
    </div>
  )
}

export const WithLoadData: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Tree treeData={treeData} loadData={onLoadData} />
    </div>
  )
}
