import { Wall } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/Wall',
  component: Wall,
};
export default meta;

type WallProps = ComponentProps<typeof Wall>;

export const Empty = {
  render: (args: WallProps) => <Wall {...args} />,
  args: { config: 'Empty' },
};

export const Default = {
  render: (args: WallProps) => <Wall {...args} />,
  args: { config: 'Default' },
};

export const Special = {
  render: (args: WallProps) => <Wall {...args} />,
  args: { config: 'Special' },
};
