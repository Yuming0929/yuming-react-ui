import { Accordion, AccordionItem } from '@yuming/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '手风琴组件，用于显示和隐藏内容。'
      }
    }
  },
  tags: ['autodocs']
}

export default meta

export const Default: StoryObj<typeof Accordion> = {
  render: args => (
    <div style={{ width: '400px', height: '800px' }}>
      <Accordion {...args} defaultActiveKey="1">
        <AccordionItem value="1" title="Panel 1">
          <p>Content for panel 1</p>
          {/* super long content for panel 1 */}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quos.
          </p>
        </AccordionItem>
        <AccordionItem value="2" title="Panel 2">
          <p>Content for panel 2</p>
        </AccordionItem>
        <AccordionItem value="3" title="Panel 3">
          <p>Content for panel 3</p>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export const Multiple: StoryObj<typeof Accordion> = {
  render: args => (
    <div style={{ width: '200px', height: '800px' }}>
      <Accordion {...args} multiple defaultActiveKey={['1', '2']}>
        <AccordionItem value="1" title="Panel 1">
          <p>Content for panel 1</p>
        </AccordionItem>
        <AccordionItem value="2" title="Panel 2">
          <p>Content for panel 2</p>
        </AccordionItem>
        <AccordionItem value="3" title="Panel 3">
          <p>Content for panel 3</p>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
