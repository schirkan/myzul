import { ScoreBoard } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'ScoreBoard',
  component: ScoreBoard,
};
export default meta;

type ScoreBoardProps = ComponentProps<typeof ScoreBoard>;

export const Default = {
  render: (args: ScoreBoardProps) => <ScoreBoard {...args} />,
  args: {},
};
