import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TilePlaceholder } from './';

export default {
  title: 'Azul/TilePlaceholder',
  component: TilePlaceholder,
} as ComponentMeta<typeof TilePlaceholder>;

const Template: ComponentStory<typeof TilePlaceholder> = (args) => <TilePlaceholder {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
