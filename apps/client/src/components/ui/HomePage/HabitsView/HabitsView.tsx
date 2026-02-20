import { useMemo, useState, type JSX } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';
import styles from './HabitsView.module.css';
import {
  generateHeaderDateString,
  generateISODate,
  generateWeeklyDays,
} from '../../../../helpers/utils/dates.utils';

export default function HabitsView(): JSX.Element {
  const [selectedDay, setSelectedDay] = useState(() => {
    const day = new Date();
    return generateISODate(day);
  });
  const days = useMemo(
    () => generateWeeklyDays(new Date(selectedDay.replaceAll('-', '/'))),
    [selectedDay],
  );

  const _date = new Date(selectedDay);
  _date.setDate(_date.getDate() + 1);
  const dateString = generateHeaderDateString(_date);

  const onDateNavigationClick = (event: React.MouseEvent<SVGElement>) => {
    const action = (event.target as SVGAElement).dataset['action'] as
      | 'back'
      | 'next';
    const offset = action === 'back' ? -7 : 7;
    const newDate = new Date(selectedDay.replaceAll('-', '/'));
    newDate.setDate(newDate.getDate() + offset);

    setSelectedDay(generateISODate(newDate));
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__fullDate}>
          <MdNavigateBefore data-action="back" onClick={onDateNavigationClick} />
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
  
      <div className={styles.list}>

      </div>
    </>
  );
}
