import { type JSX } from 'react';
import { format } from 'date-fns';
import type { GoalFormDTO, GoalResponseDTO } from '@fokus/shared';
import styles from './Goal.module.css';
import FokusIcon from '../Icon/Icon';
import { Link } from 'react-router-dom';
import { APP_URLS } from '../../../helpers/app.helpers';

interface GoalProps {
  goal: GoalFormDTO & {
    isCompleted: GoalResponseDTO['isCompleted'];
    currentValue: number;
    id: string;
  };
  categoryName: string | null;
  onPreviewClick: () => void;
}

export default function Goal({
  goal,
  categoryName,
  onPreviewClick,
}: GoalProps): JSX.Element {
  return (
    <div
      className={`${styles.goal} ${goal.isCompleted ? styles.goal_completed : ''}`}
    >
      <div
        onClick={onPreviewClick}
        className={styles.goal__color}
        style={{ backgroundColor: goal.color }}
      ></div>
      <div className={styles.goal__content} onClick={onPreviewClick}>
        <strong className={styles.content__title}>{goal.title}</strong>

        <div className={styles.content__value}>
          <div>
            <FokusIcon iconKey="target" />
            {goal.type === 'quantitative' ? (
              <span>
                {goal.currentValue}/{goal.targetValue || 1} {goal.unitOfMeasure}
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
                minWidth: `${(goal.currentValue / (goal.targetValue || 1)) * 100}%`,
              }}
            ></span>
          </div>
        </div>

        <div className={styles.content__bottom}>
          {!!categoryName && (
            <div className={styles.content__tag}>
              <FokusIcon iconKey="tag" />
              <span>{categoryName}</span>
            </div>
          )}

          <span></span>

          {!!goal.deadline && (
            <div className={styles.content__deadline}>
              <FokusIcon iconKey="calendar" />
              {format(goal.deadline, 'dd/MM/yyyy')}
            </div>
          )}
        </div>
      </div>
      <Link
        to={`${APP_URLS.goals}/${goal.id}/logs`}
        className={styles.goal__logs}
        title="Ver todos os registros da meta"
      >
        <FokusIcon iconKey="logs" />
      </Link>
    </div>
  );
}
