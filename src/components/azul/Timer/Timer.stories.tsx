import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Timer } from './';

export default {
  title: 'Timer',
  component: Timer,
} as ComponentMeta<typeof Timer>;

const Template: ComponentStory<typeof Timer> = (args) => <Timer {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
