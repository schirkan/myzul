import { GameSetupSingleplayer } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'GameSetupSingleplayer',
  component: GameSetupSingleplayer,
};
export default meta;

type GameSetupSingleplayerProps = ComponentProps<typeof GameSetupSingleplayer>;

export const Default = {
  render: (args: GameSetupSingleplayerProps) => <GameSetupSingleplayer {...args} />,
  args: {},
};
