import { useEffect, useState, type JSX } from 'react';
import styles from './CategoryField.module.css';
import FokusIcon from '../../../common/Icon/Icon';

interface CategoryFieldProps {
  value?: string | null;
  categoriesMap: Record<string, string>;
  isFetching: boolean;
  isError: boolean;
  onChange: (category: string | null) => void;
}

export default function CategoryField({
  value,
  categoriesMap,
  isFetching,
  isError,
  onChange,
}: CategoryFieldProps): JSX.Element {
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
    <div className={styles.categoryField}>
      <p id="category-field-label">Categoria</p>

      <div
        role="combobox"
        aria-labelledby="category-field-label"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="category-field-listbox"
        className={styles.categoryField__toggle}
      >
        <FokusIcon iconKey="tag" />
        <span>{value ? categoriesMap[value] : 'Nenhuma'}</span>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen
              ? 'Fechar seletor de categoria'
              : 'Abrir seletor de categoria'
          }
          type="button"
        >
          <FokusIcon iconKey={isOpen ? 'big-up' : 'big-down'} />
        </button>
      </div>

      <div
        className={styles.categoryField__items}
        style={{ display: isOpen ? 'grid' : 'none' }}
        id="category-field-listbox"
        role="listbox"
        aria-label="Lista de categorias disponíveis"
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setIsOpen(false);
          }}
          className={value === null ? styles.active : ''}
          role="option"
          key={`category-null`}
          aria-selected={value === null}
        >
          Nenhuma
        </button>
        {(() => {
          if (isFetching) {
            return Array.from({ length: 5 }).map(() => (
              <div className={styles.category__skeleton}></div>
            ));
          }

          if (isError) {
            return <p className={styles.category__errorMsg}>Erro ao retornar suas categorias.</p>;
          }

          return Object.entries(categoriesMap).map(([categoryId, name]) => (
            <button
              type="button"
              onClick={() => {
                onChange(categoryId);
                setIsOpen(false);
              }}
              className={value === categoryId ? styles.active : ''}
              role="option"
              key={`category-${categoryId}`}
              aria-selected={value === categoryId}
            >
              {name}
            </button>
          ));
        })()}
      </div>
    </div>
  );
}
