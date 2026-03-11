import type { JSX } from 'react';
import styles from './ReminderField.module.css';
import type { HabitCreateDTO } from '@fokus/shared';
import { type UseFormSetValue, type UseFormClearErrors } from 'react-hook-form';

type Habit = Omit<HabitCreateDTO, 'userId'>;

interface ReminderFieldProps {
  reminder?: string | null;
  setValue: UseFormSetValue<Habit>;
  clearErrors: UseFormClearErrors<Habit>;
  className?: string;
}

export default function ReminderField({
  reminder,
  setValue,
  clearErrors,
  className,
}: ReminderFieldProps): JSX.Element {
  const handleReminderKeyDown = (event: React.KeyboardEvent) => {
    if (
      ['Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(
        event.key,
      )
    ) {
      return;
    }

    const val =
      `${(event.target as HTMLInputElement).value}${event.key}`.padStart(
        2,
        '0',
      );
    if ((event.target as HTMLInputElement).dataset['reminder'] === 'hour') {
      if (!/^([0-1][0-9])|(2[0-3])$/.test(val)) {
        event.preventDefault();
        return;
      }

      setValue('reminder', `${val}:${(reminder as string)?.slice(3) || '00'}`);
    } else {
      if (!/^[0-5][0-9]$/.test(val)) {
        event.preventDefault();
        return;
      }

      setValue(
        'reminder',
        `${(reminder as string)?.slice(0, 2) || '00'}:${val}`,
      );
    }
  };
  return (
    <div
      className={`${styles.reminder} ${className}`}
      role="radiogroup"
      aria-labelledby="reminder-label"
    >
      <p id="reminder-label">Lembrete</p>
      <div className={styles.reminder__propToggle}>
        <span
          onClick={() => {
            setValue('reminder', null, {
              shouldDirty: true,
            });
            clearErrors();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setValue('reminder', null, {
                shouldDirty: true,
              });
              clearErrors();
            }
          }}
          className={reminder === null ? styles.active : ''}
          tabIndex={0}
          role="radio"
          aria-checked={!reminder}
        >
          Não
        </span>
        <div aria-hidden="true"></div>
        <span
          onClick={() => {
            setValue('reminder', '', {
              shouldDirty: true,
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setValue('reminder', '', {
                shouldDirty: true,
              });
            }
          }}
          className={reminder !== null ? styles.active : ''}
          tabIndex={0}
          role="radio"
          aria-checked={reminder !== null}
        >
          Sim
        </span>
      </div>

      {reminder !== null && (
        <div
          className={styles.reminder__values}
          aria-live="polite"
          role="region"
          aria-label="Configuração de lembrete"
        >
          <div>
            <label htmlFor="reminder-hour">Horas</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="12"
              onKeyDown={handleReminderKeyDown}
              data-reminder="hour"
              id="reminder-hour"
            />
          </div>
          <span aria-hidden="true">:</span>
          <div>
            <label htmlFor="reminder-minutes">Minutos</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="30"
              onKeyDown={handleReminderKeyDown}
              data-reminder="min"
              id="reminder-minutes"
            />
          </div>
        </div>
      )}
    </div>
  );
}
