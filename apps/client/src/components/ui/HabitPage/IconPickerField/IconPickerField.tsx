import { useEffect, useState, type JSX } from 'react';
import styles from './IconPickerField.module.css';
import FokusIcon, {
  USER_HABIT_ICONS,
  type FokusIconKey,
} from '../../../common/Icon/Icon';

interface IconPickerProps {
  value?: FokusIconKey;
  onChange: (icon: FokusIconKey) => void;
}

export default function IconPickerField({
  value = 'music',
  onChange,
}: IconPickerProps): JSX.Element {
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
    <div className={styles.iconPicker}>
      <p id="icon-picker">Escolha o ícone</p>

      <div className={styles.iconPicker__toggle}>
        <FokusIcon iconKey={value} aria-hidden="true" />
        <span className="g_sr-only">{`Ícone ${value} selecionado`}</span>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          role="combobox"
          aria-labelledby="icon-picker"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="icons-listbox"
          aria-label={
            isOpen ? 'Fechar seletor de ícoens' : 'Abrir seletor de ícones'
          }
          type="button"
        >
          <FokusIcon iconKey={isOpen ? 'big-up' : 'big-down'} />
        </button>
      </div>

      <div
        className={styles.iconPicker__icons}
        style={{ display: isOpen ? 'grid' : 'none' }}
        id="icons-listbox"
        role="listbox"
        aria-label="Lista de ícones disponíveis"
        aria-hidden={!isOpen}
      >
        {Object.keys(USER_HABIT_ICONS).map((i) => (
          <button
            onClick={() => {
              onChange(i as FokusIconKey);
              setIsOpen(false);
            }}
            type="button"
            className={`icon ${i === value ? styles.active : ''}`}
            key={i}
            role="option"
            aria-selected={i === value}
          >
            <FokusIcon iconKey={i as FokusIconKey} />
          </button>
        ))}
      </div>
    </div>
  );
}
