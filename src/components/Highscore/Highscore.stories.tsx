import { Highscore } from './';
import { ComponentProps } from 'react';

const meta = {
  title: 'Highscore',
  component: Highscore,
};
export default meta;

type HighscoreProps = ComponentProps<typeof Highscore>;

export const Default = {
  render: (args: HighscoreProps) => <Highscore {...args} />,
  args: {},
};
