import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GameSetupSingleplayer } from './';

export default {
  title: 'GameSetupSingleplayer',
  component: GameSetupSingleplayer,
} as ComponentMeta<typeof GameSetupSingleplayer>;

const Template: ComponentStory<typeof GameSetupSingleplayer> = (args) => <GameSetupSingleplayer {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
