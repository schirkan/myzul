import { FloorLine } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/FloorLine',
  component: FloorLine,
};
export default meta;

type FloorLineProps = ComponentProps<typeof FloorLine>;

export const Default = {
  render: (args: FloorLineProps) => <FloorLine {...args} />,
  args: {},
};
