import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Wall } from './';

export default {
  title: 'Azul/Wall',
  component: Wall,
} as ComponentMeta<typeof Wall>;

const Template: ComponentStory<typeof Wall> = (args) => <Wall {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
