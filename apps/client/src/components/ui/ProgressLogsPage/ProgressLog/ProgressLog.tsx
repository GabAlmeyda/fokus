import type { ProgressLogResponseDTO } from '@fokus/shared';
import styles from './ProgressLog.module.css';
import { format } from 'date-fns';
import FokusIcon from '../../../common/Icon/Icon';
import { useEffect, useRef } from 'react';

interface ProgressLogsProps {
  log: Omit<ProgressLogResponseDTO, 'userId'>;
  unitOfMeasure?: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onDeleteClick: () => void;
}

export default function ProgressLog({
  log,
  unitOfMeasure = null,
  isOpen,
  onToggle,
  onDeleteClick,
}: ProgressLogsProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const callback = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', callback);

    return () => document.removeEventListener('mousedown', callback);
  }, [isOpen]);

  return (
    <div className={styles.log}>
      <div className={styles.log__color}></div>
      <div className={styles.log__content}>
        <p
          className={styles.content__date}
          aria-label={`Data do registro: ${format(log.date, 'dd/MM/yyyy')}`}
        >
          <FokusIcon iconKey="calendar" />
          <span aria-hidden="true">{format(log.date, 'dd/MM/yyyy')}</span>
        </p>
        <p
          className={styles.content__value}
          aria-label={
            `Valor registrado: ${log.value}` +
            (unitOfMeasure && '(meta concluída)')
          }
        >
          <FokusIcon iconKey="marked" />+{log.value}{' '}
          <span aria-hidden="true">
            {unitOfMeasure ? unitOfMeasure.toLowerCase() : '(Concluída)'}
          </span>
        </p>

        <p className={styles.content__habitId}>
          {log.habitId ? 'Meta atualizada por hábito' : 'Registro manual'}
        </p>

        <div className={styles.log__menu} ref={menuRef}>
          <button
            onClick={onToggle}
            className={styles.menu__btn}
            aria-controls="menu"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={
              isOpen
                ? 'Fechar mais opções de registro'
                : 'Abrir mais opções de registro'
            }
          >
            <FokusIcon iconKey="menu" aria-hidden="true" />
          </button>

          <div
            className={styles.menu__list}
            style={{ display: isOpen ? 'block' : 'none' }}
            id="menu"
            aria-hidden={!isOpen}
            role="menu"
          >
            <button type="button" onClick={onDeleteClick} role="menuitem">
              Deletar registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
