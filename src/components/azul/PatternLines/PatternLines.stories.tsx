import { PatternLines } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/PatternLines',
  component: PatternLines,
};
export default meta;

type PatternLinesProps = ComponentProps<typeof PatternLines>;

export const Default = {
  render: (args: PatternLinesProps) => <PatternLines {...args} />,
  args: {},
};
