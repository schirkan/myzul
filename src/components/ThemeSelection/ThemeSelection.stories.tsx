import { ThemeSelection } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'ThemeSelection',
  component: ThemeSelection,
};
export default meta;

type ThemeSelectionProps = ComponentProps<typeof ThemeSelection>;

export const Default = {
  render: (args: ThemeSelectionProps) => <ThemeSelection {...args} />,
  args: {},
};
