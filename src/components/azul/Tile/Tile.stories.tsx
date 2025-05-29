import { Tile } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/Tile',
  component: Tile,
};
export default meta;

type TileProps = ComponentProps<typeof Tile>;

export const Default = {
  render: (args: TileProps) => <Tile {...args} />,
  args: {},
};
