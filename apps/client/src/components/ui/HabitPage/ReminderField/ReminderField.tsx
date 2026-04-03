import { useState, type JSX } from 'react';
import styles from './ReminderField.module.css';
import type { HabitFormDTO } from '@fokus/shared';
import {
  type UseFormSetValue,
  type UseFormClearErrors,
  type FieldErrors,
} from 'react-hook-form';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';

interface ReminderFieldProps {
  reminder?: string | null;
  setValue: UseFormSetValue<HabitFormDTO>;
  errors: FieldErrors<HabitFormDTO>;
  clearErrors: UseFormClearErrors<HabitFormDTO>;
  className?: string;
}

export default function ReminderField({
  reminder,
  setValue,
  errors,
  clearErrors,
  className,
}: ReminderFieldProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(reminder !== null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'hour' | 'min',
  ) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''));
    const [currHour, currMin] = (reminder || '00:00').split(':');

    if (type === 'hour') {
      if (val > 23) return;

      setValue('reminder', `${String(val).padStart(2, '0')}:${currMin}`);
    } else {
      if (val > 59) return;

      setValue('reminder', `${currHour}:${String(val).padStart(2, '0')}`);
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
        aria-describedby="reminder-error"
        id="reminder-values"
      >
        <div>
          <label htmlFor="reminder-hour">Horas</label>
          <input
            type="text"
            value={reminder ? reminder.split(':')[0] : ''}
            onChange={(e) => handleInputChange(e, 'hour')}
            inputMode="numeric"
            placeholder="12"
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
            value={reminder ? reminder.split(':')[1] : ''}
            onChange={(e) => handleInputChange(e, 'min')}
            inputMode="numeric"
            placeholder="30"
            aria-describedby="minutes-desc"
            id="reminder-minutes"
          />
          <span id="minutes-desc" className="g_sr-only">
            Digite os minutos entre 00 e 59
          </span>
        </div>
      </div>

      <FormErrorMessage
        id="reminder-error"
        isHidden={!isOpen || !errors.reminder}
        message={errors.reminder?.message}
      />
    </div>
  );
}
