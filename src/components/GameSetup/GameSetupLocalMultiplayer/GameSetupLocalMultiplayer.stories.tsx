import { ComponentProps } from 'react';
import { GameSetupLocalMultiplayer } from './';

const meta = {
  title: 'GameSetupLocalMultiplayer',
  component: GameSetupLocalMultiplayer,
};
export default meta;

type GameSetupLocalMultiplayerProps = ComponentProps<typeof GameSetupLocalMultiplayer>;

export const Default = {
  render: (args: GameSetupLocalMultiplayerProps) => <GameSetupLocalMultiplayer {...args} />,
  args: {},
};
