import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NotifyActivePlayer } from './';

export default {
  title: 'NotifyActivePlayer',
  component: NotifyActivePlayer,
} as ComponentMeta<typeof NotifyActivePlayer>;

const Template: ComponentStory<typeof NotifyActivePlayer> = (args) => <NotifyActivePlayer {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
