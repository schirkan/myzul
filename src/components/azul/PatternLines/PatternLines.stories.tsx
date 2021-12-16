import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PatternLines } from './';

export default {
  title: 'Azul/PatternLines',
  component: PatternLines,
} as ComponentMeta<typeof PatternLines>;

const Template: ComponentStory<typeof PatternLines> = (args) => <PatternLines {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
