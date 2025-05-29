import { CenterOfTable } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'CenterOfTable',
  component: CenterOfTable,
};
export default meta;

type CenterOfTableProps = ComponentProps<typeof CenterOfTable>;

export const Default = {
  render: (args: CenterOfTableProps) => <CenterOfTable {...args} />,
  args: {},
};
