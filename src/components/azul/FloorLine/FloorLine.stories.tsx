import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FloorLine } from './';
import { floorSetups } from './../../../games/azul/azulConfig';

export default {
  title: 'Azul/FloorLine',
  component: FloorLine,
} as ComponentMeta<typeof FloorLine>;

const Template: ComponentStory<typeof FloorLine> = (args) => <FloorLine {...args} />;

export const c1 = Template.bind({});
c1.storyName = "empty"

export const c2 = Template.bind({});
c2.args = { config: floorSetups[0] };
c2.storyName = "default"
