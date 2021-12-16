import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GameSetup } from './';

export default {
  title: 'GameSetup',
  component: GameSetup,
} as ComponentMeta<typeof GameSetup>;

const Template: ComponentStory<typeof GameSetup> = (args) => <GameSetup {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
