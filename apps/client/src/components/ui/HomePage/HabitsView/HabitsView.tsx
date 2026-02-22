import { useMemo, useState, type JSX } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';
import styles from './HabitsView.module.css';
import {
  generateHeaderDateString,
  generateISODate,
  generateWeeklyDays,
} from '../../../../helpers/utils/dates.utils';
import {
  useHabitsMutations,
  useHabitsQueries,
} from '../../../../helpers/hooks/use-habits.hook';
import type { HabitFilterDTO } from '@fokus/shared';
import { useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../../../helpers/app.helpers';
import Habit from '../../../common/Habit/Habit';

const weekDaysMap: Record<number, HabitFilterDTO['weekDay']> = {
  0: 'dom',
  1: 'seg',
  2: 'ter',
  3: 'qua',
  4: 'qui',
  5: 'sex',
  6: 'sab',
};

export default function HabitsView(): JSX.Element {
  const navigate = useNavigate();
  const checkMutation = useHabitsMutations().checkMutation;
  const uncheckMutation = useHabitsMutations().uncheckMutation;
  const [selectedDay, setSelectedDay] = useState(() => {
    const day = new Date();
    return generateISODate(day);
  });
  const dateObj = new Date(`${selectedDay}T12:00:00`);
  const { data: habits } = useHabitsQueries({
    filter: {
      weekDay: weekDaysMap[dateObj.getDate()],
    },
  }).habitsFilterQuery;
  const completedHabits = habits?.filter((h) => h.isCompletedToday);
  const days = useMemo(() => generateWeeklyDays(dateObj), [selectedDay]);
  const dateString = generateHeaderDateString(dateObj);

  const onDateNavigationClick = (event: React.MouseEvent<SVGElement>) => {
    const action = (event.target as SVGAElement).dataset['action'] as
      | 'back'
      | 'next';
    const offset = action === 'back' ? -7 : 7;
    const newDate = new Date(selectedDay.replaceAll('-', '/'));
    newDate.setDate(newDate.getDate() + offset);

    setSelectedDay(generateISODate(newDate));
  };

  const onHabitPreviewClick = (habitId: string) => {
    navigate(`${APP_URLS.habits}/${habitId}`);
  };

  const onHabitCheckClick = (habitId: string) => {
    const date = new Date(`${selectedDay}T12:00:00`);
    checkMutation.mutate(
      { habitId, date }
    );
  };

  const onHabitUncheckClick = (habitId: string) => {
    const date = new Date(`${selectedDay}T12:00:00`);
    uncheckMutation.mutate(
      { habitId, date }
    );
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__fullDate}>
          <MdNavigateBefore
            data-action="back"
            onClick={onDateNavigationClick}
          />
          <strong>{dateString}</strong>
          <MdNavigateNext data-action="next" onClick={onDateNavigationClick} />
        </div>

        <div className={styles.header__week}>
          {days.map((day) => (
            <div
              onClick={() => setSelectedDay(day.fullDate)}
              className={`
                ${styles.week__day} 
                ${day.isToday ? styles.week__day_today : ''} 
                ${day.fullDate === selectedDay ? styles.week__day_selected : ''}`}
              key={`${day.fullDate}`}
            >
              <span className={styles.day__label}>{day.label}</span>
              <strong className={styles.day__num}>{day.dayNum}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.habits}>
        {habits ? (
          <>
            <div className={styles.habits__completed}>
              {habits
                .filter((h) => !h.isCompletedToday)
                .map((h) => (
                  <Habit
                    habit={h}
                    onPreviewClick={() => onHabitPreviewClick(h.id)}
                    onCheckClick={() => onHabitCheckClick(h.id)}
                    key={h.id}
                  />
                ))}
            </div>
            <div
              className={styles.habits__uncompleted}
              style={
                completedHabits?.length
                  ? { display: 'flex' }
                  : { display: 'none' }
              }
            >
              <hr />
              {completedHabits?.map((h) => (
                <Habit
                  habit={h}
                  onPreviewClick={() => onHabitPreviewClick(h.id)}
                  onCheckClick={() => onHabitUncheckClick(h.id)}
                  key={h.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.habits_loading}>Carregando</div>
        )}
      </div>
    </>
  );
}
