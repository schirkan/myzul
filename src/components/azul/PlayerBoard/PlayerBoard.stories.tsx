import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PlayerBoard } from './';
import { defaultGameSetup } from './../../../games/azul/azulConfig';

export default {
  title: 'Azul/PlayerBoard',
  component: PlayerBoard,
} as ComponentMeta<typeof PlayerBoard>;

const Template: ComponentStory<typeof PlayerBoard> = (args) => <PlayerBoard {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
c1.args = {
  config: defaultGameSetup,
  playerId: "0"
}