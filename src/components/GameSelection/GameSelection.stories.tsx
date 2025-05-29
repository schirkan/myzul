import { ComponentProps } from 'react';
import { GameSelection } from './';

const meta = {
  title: 'GameSelection',
  component: GameSelection,
};
export default meta;

type GameSelectionProps = ComponentProps<typeof GameSelection>;

export const Default = {
  render: (args: GameSelectionProps) => <GameSelection {...args} />,
  args: {},
};
