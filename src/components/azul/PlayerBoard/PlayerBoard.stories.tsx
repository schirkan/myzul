import { PlayerBoard } from './';
import { defaultGameSetup } from './../../../games/azul/azulConfig';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/PlayerBoard',
  component: PlayerBoard,
};
export default meta;

type PlayerBoardProps = ComponentProps<typeof PlayerBoard>;

export const Default = {
  render: (args: PlayerBoardProps) => <PlayerBoard {...args} />,
  args: {
    config: defaultGameSetup,
    playerId: "0"
  },
};