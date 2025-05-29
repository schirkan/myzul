import { ComponentProps } from 'react';
import { TilePlaceholder } from './';

const meta = {
  title: 'Azul/TilePlaceholder',
  component: TilePlaceholder,
};
export default meta;

type TilePlaceholderProps = ComponentProps<typeof TilePlaceholder>;

export const Default = {
  render: (args: TilePlaceholderProps) => <TilePlaceholder {...args} />,
  args: {},
};
