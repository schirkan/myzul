import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GameSelection } from './';

export default {
  title: 'GameSelection',
  component: GameSelection,
} as ComponentMeta<typeof GameSelection>;

const Template: ComponentStory<typeof GameSelection> = (args) => <GameSelection {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
