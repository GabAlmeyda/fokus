import type { JSX } from 'react';

import styles from './GoalsView.module.css';
import FokusIcon from '../../../common/Icon/Icon';

export default function GoalsView(): JSX.Element {
  return (
    <>
      <div className={styles.header}>
        <span>
          <FokusIcon iconKey="filter" /> Filtros
        </span>
        <div
          className={styles.header__filters}
          role="group"
          aria-label="Filtros de metas"
        >
        </div>
      </div>

      <div className={styles.goals} id='goals'></div>
    </>
  );
}
