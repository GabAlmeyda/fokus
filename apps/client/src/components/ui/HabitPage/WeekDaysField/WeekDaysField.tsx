import type { JSX } from 'react';
import styles from './WeekDaysField.module.css';
import type { HabitFormDTO } from '@fokus/shared';
import type { FieldErrors } from 'react-hook-form';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';

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
  weekDays: HabitFormDTO['weekDays'];
  onChange: (weekDays: HabitFormDTO['weekDays']) => void;
  errors: FieldErrors<HabitFormDTO>;
}

export default function WeekDaysField({
  weekDays = [],
  onChange,
  errors,
}: WeekDaysFieldProps): JSX.Element {
  return (
    <div className={styles.weekDays}>
      <p id="week-days-label">Repetir hábitos nos dias:</p>
      <div
        role="group"
        aria-labelledby="week-days-label"
        aria-describedby="week-days-error"
      >
        {Object.entries(mappedWeekDays).map(([label, day]) => {
          const isSelected = weekDays.includes(
            day as (typeof weekDays)[number],
          );

          const handleToggle = () => {
            if (!isSelected) {
              onChange([...weekDays, day] as HabitFormDTO['weekDays']);
            } else {
              onChange([...weekDays].filter((d) => d !== day));
            }
          };
          return (
            <button
              type="button"
              onClick={handleToggle}
              className={`${isSelected ? styles.active : ''}`}
              key={day}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Repetir ${fullDayNames[day]}`}
            >
              <span aria-hidden="true">{label}</span>
            </button>
          );
        })}
      </div>
      <FormErrorMessage
        id="week-days-error"
        isHidden={!errors}
        message={errors.weekDays?.message ?? ''}
      />
    </div>
  );
}
