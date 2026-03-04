import { useState, type JSX } from 'react';
import { format } from 'date-fns';
import type { GoalResponseDTO } from '@fokus/shared';
import styles from './Goal.module.css';
import FokusIcon from '../Icon/Icon';

interface GoalProps {
  goal: GoalResponseDTO;
  categoriesMap: Record<string, string>;
  onPreviewClick: () => void;
}

export default function Goal({
  goal,
  categoriesMap,
  onPreviewClick,
}: GoalProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div
      className={`${styles.goal} ${goal.isCompleted ? styles.goal_completed : ''}`}
    >
      <div
        onClick={onPreviewClick}
        className={styles.goal__icon}
        style={{ backgroundColor: goal.color }}
      ></div>
      <div className={styles.goal__content} onClick={onPreviewClick}>
        <strong className={styles.content__title}>{goal.title}</strong>

        <div className={styles.content__value}>
          <div>
            <FokusIcon iconKey="target" />
            {goal.type === 'quantitative' ? (
              <span>
                {goal.currentValue}/{goal.targetValue} {goal.unitOfMeasure}
              </span>
            ) : (
              <span>
                {goal.currentValue === 0 ? 'Não concluída' : 'Concluída'}
              </span>
            )}
          </div>
          <div>
            <span
              style={{
                minWidth: `${(goal.currentValue / goal.targetValue) * 100}%`,
              }}
            ></span>
          </div>
        </div>

        <div className={styles.content__bottom}>
          {goal.categoryId && (
            <div className={styles.content__tag}>
              <FokusIcon iconKey="tag" />
              <span>{categoriesMap[goal.categoryId].slice(0, 6)}...</span>
            </div>
          )}

          <span></span>
  
          {goal.deadline && (
            <div className={styles.content__deadline}>
              <FokusIcon iconKey="calendar" />
              {format(goal.deadline, 'dd/MM/yyyy')}
            </div>
          )}
        </div>
      </div>
      <span
        onClick={(prev) => setIsMenuOpen(!prev)}
        className={styles.goal__menuToggle}
      >
        <FokusIcon iconKey="menu" />
      </span>
      {isMenuOpen && (
        <div className={styles.goal__menu}>
          <p>Teste</p>
        </div>
      )}
    </div>
  );
}
