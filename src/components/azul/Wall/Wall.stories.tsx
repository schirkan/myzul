import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Wall } from './';

export default {
  title: 'Azul/Wall',
  component: Wall,
} as ComponentMeta<typeof Wall>;

const Template: ComponentStory<typeof Wall> = (args) => <Wall {...args} />;

export const c1 = Template.bind({});
c1.storyName = "empty"
c1.args = { config: 'Empty' }

export const c2 = Template.bind({});
c2.storyName = "default"
c2.args = { config: 'Default' }

export const c3 = Template.bind({});
c3.storyName = "special"
c3.args = { config: 'Special' }
