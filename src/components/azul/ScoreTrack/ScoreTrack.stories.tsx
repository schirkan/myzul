import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ScoreTrack } from './';

export default {
  title: 'Azul/ScoreTrack',
  component: ScoreTrack,
} as ComponentMeta<typeof ScoreTrack>;

const Template: ComponentStory<typeof ScoreTrack> = (args) => <ScoreTrack {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
