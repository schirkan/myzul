import { Timer } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Timer',
  component: Timer,
};
export default meta;

type TimerProps = ComponentProps<typeof Timer>;

export const Default = {
  render: (args: TimerProps) => <Timer {...args} />,
  args: {},
};
