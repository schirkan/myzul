import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TileStorage } from './';

export default {
  title: 'Azul/TileStorage',
  component: TileStorage,
} as ComponentMeta<typeof TileStorage>;

const Template: ComponentStory<typeof TileStorage> = (args) => <TileStorage {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
