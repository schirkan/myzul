import { GameBoard } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/GameBoard',
  component: GameBoard,
};
export default meta;

type GameBoardProps = ComponentProps<typeof GameBoard>;

export const Default = {
  render: (args: GameBoardProps) => <GameBoard {...args} />,
  args: {},
};
