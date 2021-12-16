import React from 'react';
import { TilePlaceholder } from '../TilePlaceholder';
import styles from './style.module.scss';

type Props = { player: number };

export const PatternLines: React.FC<Props> = (props) => {
  return <div className={styles.container}>
    <div>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder id={"pl|" + props.player + '|' + 1 + '|' + 1} />
    </div>
    <div>
      <p></p>
      <p></p>
      <p></p>
      <TilePlaceholder id={"pl|" + props.player + '|' + 2 + '|' + 2} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 2 + '|' + 1} />
    </div>
    <div>
      <p></p>
      <p></p>
      <TilePlaceholder id={"pl|" + props.player + '|' + 3 + '|' + 3} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 3 + '|' + 2} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 3 + '|' + 1} />
    </div>
    <div>
      <p></p>
      <TilePlaceholder id={"pl|" + props.player + '|' + 4 + '|' + 4} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 4 + '|' + 3} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 4 + '|' + 2} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 4 + '|' + 1} />
    </div>
    <div>
      <TilePlaceholder id={"pl|" + props.player + '|' + 5 + '|' + 5} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 5 + '|' + 4} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 5 + '|' + 3} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 5 + '|' + 2} />
      <TilePlaceholder id={"pl|" + props.player + '|' + 5 + '|' + 1} />
    </div>
  </div>;
};