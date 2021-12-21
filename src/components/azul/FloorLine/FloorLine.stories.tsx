import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FloorLine } from './';

export default {
  title: 'Azul/FloorLine',
  component: FloorLine,
} as ComponentMeta<typeof FloorLine>;

const Template: ComponentStory<typeof FloorLine> = (args) => <FloorLine {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
