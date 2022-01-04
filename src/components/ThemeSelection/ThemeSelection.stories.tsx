import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeSelection } from './';

export default {
  title: 'ThemeSelection',
  component: ThemeSelection,
} as ComponentMeta<typeof ThemeSelection>;

const Template: ComponentStory<typeof ThemeSelection> = (args) => <ThemeSelection {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
