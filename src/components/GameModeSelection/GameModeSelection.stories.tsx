import { ComponentProps } from 'react';
import { GameModeSelection } from '.';

const meta = {
  title: 'GameModeSelection',
  component: GameModeSelection,
};
export default meta;

type GameSelectionProps = ComponentProps<typeof GameModeSelection>;

export const Default = {
  render: (args: GameSelectionProps) => <GameModeSelection {...args} />,
  args: {},
};
