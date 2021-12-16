import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Wall } from './';
import { wallSetups } from './../../../games/azul/azulConfig';

export default {
  title: 'Azul/Wall',
  component: Wall,
} as ComponentMeta<typeof Wall>;

const Template: ComponentStory<typeof Wall> = (args) => <Wall {...args} />;

export const c1 = Template.bind({});
c1.storyName = "empty"
c1.args = { config: wallSetups[1] }

export const c2 = Template.bind({});
c2.storyName = "default"
c2.args = { config: wallSetups[0] }

export const c3 = Template.bind({});
c3.storyName = "special"
c3.args = { config: wallSetups[2] }
