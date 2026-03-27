import { useEffect, useState, type JSX } from 'react';
import styles from './HabitField.module.css';
import FokusIcon from '../../../common/Icon/Icon';

interface HabitFieldProps {
  value?: string | null;
  habitsMap: Record<
    string,
    { title: string; color: string; unitOfMeasure: string }
  >;
  isFetching: boolean;
  isError: boolean;
  onChange: (habitId: string | null, unitOfMeasure: string | null) => void;
}

export default function HabitField({
  value,
  habitsMap,
  isFetching,
  isError,
  onChange,
}: HabitFieldProps): JSX.Element {
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
    <div className={styles.habitField}>
      <p id="habit-field-label">
        <span title="Selecione um hábito para atualizar automaticamente sua meta">
          <FokusIcon iconKey="help" />
        </span>
        Hábito
      </p>

      <div
        role="combobox"
        aria-labelledby="habit-field-label"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="habit-field-listbox"
        className={styles.habitField__toggle}
      >
        <FokusIcon iconKey="target" />
        <span>
          {!!value && habitsMap[value] ? habitsMap[value]['title'] : 'Nenhum'}
        </span>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen ? 'Fechar seletor de hábito' : 'Abrir seletor de hábito'
          }
          type="button"
        >
          <FokusIcon iconKey={isOpen ? 'big-up' : 'big-down'} />
        </button>
      </div>

      <div
        className={styles.habitField__items}
        style={{ display: isOpen ? 'grid' : 'none' }}
        id="habit-field-listbox"
        role="listbox"
        aria-label="Lista de hábitos disponíveis"
        aria-hidden={!isOpen}
        aria-describedby="habit-field-info"
      >
        <button
          type="button"
          onClick={() => {
            onChange(null, null);
            setIsOpen(false);
          }}
          className={value === null ? styles.active : ''}
          role="option"
          key={`habit-null`}
          aria-selected={value === null}
        >
          <span className={styles.habit__title}>Nenhum</span>
        </button>
        {(() => {
          if (isFetching) {
            return Array.from({ length: 2 }).map(() => (
              <div className={styles.habit__skeleton}></div>
            ));
          }

          if (isError) {
            return (
              <p className={styles.habit__errorMsg}>
                Erro ao retornar seus hábitos.
              </p>
            );
          }

          return Object.entries(habitsMap).map(([habitId, habit]) => (
            <button
              type="button"
              onClick={() => {
                onChange(habitId, habit.unitOfMeasure);
                setIsOpen(false);
              }}
              className={value === habitId ? styles.active : ''}
              role="option"
              key={`habit-${habitId}`}
              aria-selected={value === habitId}
            >
              <span
                className={styles.habit__color}
                style={{ backgroundColor: habit['color'] }}
                aria-hidden="true"
              ></span>
              <span className={styles.habit__title}>{habit['title']}</span>
              <span className={styles.habit__unitOfMeasure}>
                Unidade: {habit['unitOfMeasure']}
              </span>
            </button>
          ));
        })()}
      </div>
      <span
        style={{ display: isOpen ? 'block' : 'none' }}
        id="habit-field-info"
        aria-hidden={!isOpen}
      >
        Somente hábitos quantitativos aparecem aqui.
      </span>
    </div>
  );
}
