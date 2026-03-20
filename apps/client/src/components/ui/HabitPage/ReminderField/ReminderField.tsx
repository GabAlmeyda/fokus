import { useState, type JSX } from 'react';
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
  const [isOpen, setIsOpen] = useState<boolean>(reminder !== null);

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

  const handleReminderToggle = (enabled: boolean) => {
    const value = enabled ? '' : null;
    setValue('reminder', value, {
      shouldDirty: true,
    });

    setIsOpen((prev) => !prev);
    if (!enabled) clearErrors();
  };

  return (
    <div
      className={`${styles.reminder} ${className}`}
      role="group"
      aria-labelledby="reminder-label"
    >
      <p id="reminder-label">Lembrete</p>
      <button
        className={`${styles.reminder__propToggle} ${isOpen ? styles.active : ''}`}
        type="button"
        onClick={() => handleReminderToggle(!isOpen)}
        aria-pressed={isOpen}
        aria-controls="type-values"
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? 'Desativar progresso para o hábito'
            : 'Ativar progresso para o hábito'
        }
      >
        <div aria-hidden="true"></div>
      </button>

      <div
        className={styles.reminder__values}
        style={{ display: isOpen ? 'flex' : 'none' }}
        role="group"
        aria-label="Horário do lembrete"
        aria-hidden={!isOpen}
        id="reminder-values"
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
            aria-describedby="hour-desc"
            id="reminder-hour"
          />
          <span id="hour-desc" className="g_sr-only">
            Digite a hora entre 00 e 23
          </span>
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
            aria-describedby="minutes-desc"
            id="reminder-minutes"
          />
          <span id="minutes-desc" className="g_sr-only">
            Digite os minutos entre 00 e 59
          </span>
        </div>
      </div>
    </div>
  );
}
