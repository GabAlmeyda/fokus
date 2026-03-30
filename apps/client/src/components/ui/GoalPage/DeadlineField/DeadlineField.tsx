import { useEffect, useState, type JSX } from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import styles from './DeadlineField.module.css';
import FokusIcon from '../../../common/Icon/Icon';
import { format } from 'date-fns';

const date = new Date()

interface DeadlineFieldProps {
  value?: Date | null;
  onChange: (date: Date) => void;
}

export default function DeadlineField({
  value,
  onChange,
}: DeadlineFieldProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', callback);
    return () => document.removeEventListener('keydown', callback);
  }, []);

  return (
    <div className={styles.deadlineField}>
      <p id="deadline-field-label">Data limite</p>

      <div
        aria-labelledby="deadline-field-label"
        className={styles.deadlineField__toggle}
      >
        <FokusIcon iconKey="calendar" />
        <span>{value ? format(value, 'dd/MM/yyyy') : 'Nenhuma'}</span>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen
              ? 'Fechar seletor de categoria'
              : 'Abrir seletor de categoria'
          }
          type="button"
          aria-controls="deadline-date"
          aria-expanded={isOpen}
        >
          <FokusIcon iconKey={isOpen ? 'big-up' : 'big-down'} />
        </button>
      </div>

      <div
        id="deadline-date"
        className={styles.deadlineField__date}
        style={{ display: isOpen ? 'grid' : 'none' }}
      >
        <DayPicker
          mode="single"
          selected={value || undefined}
          onSelect={(value) => {
            onChange(value);
            setIsOpen(false);
          }}
          disabled={{before: date}}
          locale={ptBR}
          required={true}
          classNames={{
            root: styles.date__container,
            months: styles.date__months,
            nav: styles.date__nav,
            month_grid: styles.date__monthGrid,
            month_caption: styles.date__monthCaption,
            weeks: styles.date__weeks,
            selected: styles.date__selected,
            today: styles.date__today,
            day: styles.date__day,
            disabled: styles.date__disabled
          }}
        />
      </div>
    </div>
  );
}
