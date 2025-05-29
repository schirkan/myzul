import { SubmitUserScore } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'SubmitUserScore',
  component: SubmitUserScore,
};
export default meta;

type SubmitUserScoreProps = ComponentProps<typeof SubmitUserScore>;

export const Default = {
  render: (args: SubmitUserScoreProps) => <SubmitUserScore {...args} />,
  args: {},
};
