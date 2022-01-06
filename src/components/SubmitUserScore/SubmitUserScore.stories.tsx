import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SubmitUserScore } from './';

export default {
  title: 'SubmitUserScore',
  component: SubmitUserScore,
} as ComponentMeta<typeof SubmitUserScore>;

const Template: ComponentStory<typeof SubmitUserScore> = (args) => <SubmitUserScore {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
