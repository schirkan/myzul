import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CenterOfTable } from './';

export default {
  title: 'CenterOfTable',
  component: CenterOfTable,
} as ComponentMeta<typeof CenterOfTable>;

const Template: ComponentStory<typeof CenterOfTable> = (args) => <CenterOfTable {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
