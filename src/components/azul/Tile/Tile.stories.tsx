import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tile } from './';

export default {
  title: 'Azul/Tile',
  component: Tile,
} as ComponentMeta<typeof Tile>;

const Template: ComponentStory<typeof Tile> = (args) => <Tile {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
