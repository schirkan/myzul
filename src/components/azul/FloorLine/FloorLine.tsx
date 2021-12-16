import React from 'react';
import { FloorLineSetup } from '../../../games/azul/azulConfig';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = { config: FloorLineSetup };

export const FloorLine: React.FC<Props> = (props) => {
  const values = props?.config?.values || [0, 0, 0, 0, 0, 0, 0];

  return <div className={styles.container}>
    <span>{values[0]}</span>
    <span>{values[1]}</span>
    <span>{values[2]}</span>
    <span>{values[3]}</span>
    <span>{values[4]}</span>
    <span>{values[5]}</span>
    <span>{values[6]}</span>
    <TilePlaceholder />
    <TilePlaceholder />
    <TilePlaceholder />
    <TilePlaceholder />
    <TilePlaceholder />
    <TilePlaceholder />
    <TilePlaceholder />
  </div>;
};