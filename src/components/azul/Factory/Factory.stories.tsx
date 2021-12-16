import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Factory } from './';

export default {
  title: 'Azul/Factory',
  component: Factory,
} as ComponentMeta<typeof Factory>;

const Template: ComponentStory<typeof Factory> = (args) => <Factory {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
