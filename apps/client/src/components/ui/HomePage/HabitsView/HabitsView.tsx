import { useMemo, useState, type JSX } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';
import styles from './HabitsView.module.css';
import {
  generateHeaderDateString,
  generateWeeklyDays,
} from '../../../../helpers/utils/dates.utils';
import {
  useHabitMutations,
  useHabitQueries,
} from '../../../../helpers/hooks/use-habit.hook';
import type { HabitFilterDTO } from '@fokus/shared';
import { useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../../../helpers/app.helpers';
import Habit from '../../../common/Habit/Habit';
import { addDays, format } from 'date-fns';

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
  const checkMutation = useHabitMutations().checkMutation;
  const uncheckMutation = useHabitMutations().uncheckMutation;
  const [selectedDay, setSelectedDay] = useState(() => {
    const day = new Date().toISOString();
    return format(day, 'yyyy-MM-dd');
  });
  const dateObj = new Date(selectedDay + 'T12:00:00Z');
  const { data: habits } = useHabitQueries({
    filter: {
      weekDay: weekDaysMap[dateObj.getDay()],
    },
    selectedDate: dateObj,
  }).habitsFilterQuery;
  const completedHabits = habits?.filter((h) => h.isCompleted);
  const days = useMemo(() => generateWeeklyDays(dateObj), [selectedDay]);
  const dateString = generateHeaderDateString(dateObj);

  const onDateNavigationClick = (event: React.MouseEvent<SVGElement>) => {
    const action = (event.currentTarget as SVGAElement).dataset['action'] as
      | 'back'
      | 'next';
    const offset = action === 'back' ? -7 : 7;
    const newDate = addDays(dateObj, offset);

    setSelectedDay(format(newDate, 'yyyy-MM-dd'));
  };

  const onHabitPreviewClick = (habitId: string) => {
    navigate(`${APP_URLS.habits}/${habitId}`);
  };

  const onHabitCheckClick = (habitId: string) => {
    const date = new Date(selectedDay + 'T12:00:00Z');
    checkMutation.mutate({ habitId, date });
  };

  const onHabitUncheckClick = (habitId: string) => {
    const date = new Date(selectedDay + 'T12:00:00Z');
    uncheckMutation.mutate({ habitId, date });
  };

  console.log(habits?.map((h) => h.isCompleted));

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
                .filter((h) => !h.isCompleted)
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
              style={completedHabits?.length === 0 ? { display: 'none' } : undefined}
            >
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
