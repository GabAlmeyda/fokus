import { type JSX } from 'react';
import styles from './ColorPicker.module.css';

const validColors = {
  Vermelho: '#C92023',
  Laranja: '#B56617',
  Amarelo: '#C9C320',
  Verde: '#17B517',
  Ciano: '#17B5B5',
  Roxo: '#8838DD',
  Cinza: '#333C36',
};

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
}

export default function ColorPicker({
  value,
  onChange,
}: ColorPickerProps): JSX.Element {
  return (
    <div
      className={styles.colorPicker}
      role='radiogroup'
      aria-label="Escolha uma cor para o hábito"
    >
      {Object.entries(validColors).map(([name, hex]) => (
        <div
          onClick={() => onChange?.(hex)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onChange?.(hex);
            }
          }}
          style={{ backgroundColor: hex }}
          className={value === hex ? styles.active : ''}
          key={hex}
          role='radio'
          aria-checked={value === hex}
          aria-label={name}
          tabIndex={0}
          title={name}
        ></div>
      ))}
    </div>
  );
}
