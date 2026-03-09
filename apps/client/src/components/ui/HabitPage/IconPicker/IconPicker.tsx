import { useEffect, useRef, useState, type JSX } from 'react';
import styles from './IconPicker.module.css';
import FokusIcon, {
  USER_HABIT_ICONS,
  type FokusIconKey,
} from '../../../common/Icon/Icon';

interface IconPickerProps {
  value?: FokusIconKey;
  onChange?: (icon: FokusIconKey) => void;
}

export default function IconPicker({
  value = 'music',
  onChange,
}: IconPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const iconsRef = useRef<HTMLDivElement>(null);

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
    <div className={styles.iconPicker} ref={iconsRef}>
      <p id="icon-picker">Escolha o ícone</p>

      <div
        role="combobox"
        aria-labelledby="icon-picker"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="icons-listbox"
        className={styles.iconPicker__toggle}
      >
        <FokusIcon iconKey={value} />
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen ? 'Fechar seletor de ícondes' : 'Abrir seletor de ícones'
          }
          type="button"
        >
          <FokusIcon iconKey={isOpen ? 'big-up' : 'big-down'} />
        </button>
      </div>

      {isOpen && (
        <div
          className={styles.iconPicker__icons}
          id="icons-listbox"
          role="listbox"
          aria-label="Lista de ícones disponíveis"
        >
          {Object.keys(USER_HABIT_ICONS).map((i) => (
            <div
              onClick={() => {
                onChange?.(i as FokusIconKey);
                setIsOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onChange?.(i as FokusIconKey);
                  setIsOpen(false);
                }
              }}
              className={`icon ${i === value ? styles.active : ''}`}
              key={i}
              tabIndex={0}
              role="option"
              aria-selected={i === value}
            >
              <FokusIcon iconKey={i as FokusIconKey} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
