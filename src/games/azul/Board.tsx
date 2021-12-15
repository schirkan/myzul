import React from 'react'
import type { BoardProps } from 'boardgame.io/react';
import { MainBoard } from './MainBoard';
import { PlayerBoard } from './PlayerBoard';
import './style.scss'

interface MyGameProps extends BoardProps {
  // Custom properties for your component
}

export const AzulGameBoard = (props: MyGameProps) => {

  return <div className='Azul-Board'>
    <header>header</header>
    <main>
      <MainBoard />
      <PlayerBoard />
    </main>
    <footer>footer</footer>
  </div>;
}