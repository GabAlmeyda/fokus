import type { JSX } from 'react';
import styles from './WeekDaysField.module.css';
import type { HabitCreateDTO } from '@fokus/shared';

const mappedWeekDays: Record<string, string> = {
  Dom: 'dom',
  Seg: 'seg',
  Ter: 'ter',
  Qua: 'qua',
  Qui: 'qui',
  Sex: 'sex',
  Sáb: 'sab',
};
const fullDayNames: Record<string, string> = {
  dom: 'aos domingos',
  seg: 'às segundas-feiras',
  ter: 'às terças-feiras',
  qua: 'às quartas-feiras',
  qui: 'às quintas-feiras',
  sex: 'às sextas-feiras',
  sab: 'aos sábados',
};

interface WeekDaysFieldProps {
  weekDays: HabitCreateDTO['weekDays'];
  onChange: (...event: any[]) => void;
}

export default function WeekDaysField({
  weekDays,
  onChange,
}: WeekDaysFieldProps): JSX.Element {
  return (
    <div
      className={styles.weekDays}
      aria-labelledby="week-days-label"
    >
      <p id="week-days-label">Repetir hábitos nos dias:</p>
      <div role='group'>
        {Object.entries(mappedWeekDays).map(([label, day]) => {
          const isSelected = weekDays.includes(
            day as HabitCreateDTO['weekDays'][number],
          );

          const handleToggle = () => {
            if (!isSelected) {
              onChange([...weekDays, day]);
            } else {
              onChange([...weekDays].filter((d) => d !== day));
            }
          };
          return (
            <button
              onClick={handleToggle}
              className={`${isSelected ? styles.active : ''}`}
              key={day}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Repetir ${fullDayNames[day]}`}
            >
              <span aria-hidden='true'>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
