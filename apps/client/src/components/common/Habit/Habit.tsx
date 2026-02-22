import type { JSX } from 'react';
import styles from './Habit.module.css';
import FokusIcon, { type FokusIconKey } from '../Icon/Icon';
import type { HabitResponseDTO } from '@fokus/shared';

interface HabitProps {
  habit: HabitResponseDTO;
  onPreviewClick: () => void;
  onCheckClick: () => void;
}

export default function Habit({
  habit,
  onPreviewClick,
  onCheckClick,
}: HabitProps): JSX.Element {
  return (
    <div
      className={`${styles.habit} ${habit.isCompletedToday ? styles.habit_completed : ''}`}
    >
      <div
        onClick={onPreviewClick}
        className={styles.habit__icon}
        style={{ backgroundColor: habit.color }}
      >
        <FokusIcon iconKey={habit.icon as FokusIconKey} />
      </div>
      <div className={styles.habit__content} onClick={onPreviewClick}>
        <div className={styles.content__reminder}>
          <FokusIcon iconKey="bell" />
          <span
            className={
              habit.reminder ? '' : styles.content__reminder_notDefined
            }
          >
            {habit.reminder ? habit.reminder : 'Sem lembrete'}
          </span>
        </div>
        <strong className={styles.content__title}>{habit.title}</strong>
      </div>
      <span
        onClick={onCheckClick}
        data-action="check"
        className={styles.habit__completion}
      >
        <FokusIcon iconKey={habit.isCompletedToday ? 'marked' : 'unmarked'} />
      </span>
    </div>
  );
}
