import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Highscore } from './';

export default {
  title: 'Highscore',
  component: Highscore,
} as ComponentMeta<typeof Highscore>;

const Template: ComponentStory<typeof Highscore> = (args) => <Highscore {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
