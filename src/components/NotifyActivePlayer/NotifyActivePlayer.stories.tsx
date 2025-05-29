import { NotifyActivePlayer } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'NotifyActivePlayer',
  component: NotifyActivePlayer,
};
export default meta;

type NotifyActivePlayerProps = ComponentProps<typeof NotifyActivePlayer>;

export const Default = {
  render: (args: NotifyActivePlayerProps) => <NotifyActivePlayer {...args} />,
  args: {},
};
