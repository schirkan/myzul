import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GameBoard } from './';
import { defaultGameSetup } from './../../../games/azul/azulConfig';

export default {
  title: 'Azul/GameBoard',
  component: GameBoard,
} as ComponentMeta<typeof GameBoard>;

const Template: ComponentStory<typeof GameBoard> = (args) => <GameBoard {...args} />;

export const c1 = Template.bind({});
c1.storyName = "default"
c1.args = {}
