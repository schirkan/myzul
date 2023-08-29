import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GameSetupLocalMultiplayer } from './';

export default {
  title: 'GameSetupLocalMultiplayer',
  component: GameSetupLocalMultiplayer,
} as ComponentMeta<typeof GameSetupLocalMultiplayer>;

const Template: ComponentStory<typeof GameSetupLocalMultiplayer> = (args) => <GameSetupLocalMultiplayer {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
