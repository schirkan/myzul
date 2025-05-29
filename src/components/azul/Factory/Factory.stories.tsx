import { Factory } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/Factory',
  component: Factory,
};
export default meta;

type FactoryProps = ComponentProps<typeof Factory>;

export const Default = {
  render: (args: FactoryProps) => <Factory {...args} />,
  args: {},
};
