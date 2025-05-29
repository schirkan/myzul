import { TileStorage } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Azul/TileStorage',
  component: TileStorage,
};
export default meta;

type TileStorageProps = ComponentProps<typeof TileStorage>;

export const Default = {
  render: (args: TileStorageProps) => <TileStorage {...args} />,
  args: {},
};
