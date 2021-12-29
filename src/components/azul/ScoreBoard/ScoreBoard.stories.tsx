import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ScoreBoard } from './';

export default {
  title: 'ScoreBoard',
  component: ScoreBoard,
} as ComponentMeta<typeof ScoreBoard>;

const Template: ComponentStory<typeof ScoreBoard> = (args) => <ScoreBoard {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
