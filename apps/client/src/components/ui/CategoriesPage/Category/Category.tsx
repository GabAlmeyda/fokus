import type { CategoryResponseDTO } from '@fokus/shared';
import styles from './Category.module.css';
import FokusIcon from '../../../common/Icon/Icon';
import { useEffect, useRef } from 'react';

interface ProgresscategorysProps {
  category: Omit<CategoryResponseDTO, 'userId'>;
  isOpen: boolean;
  onToggle: () => void;
  onDeleteClick: () => void;
  onUpdateClick: () => void;
}

export default function Category({
  category,
  isOpen,
  onToggle,
  onDeleteClick,
  onUpdateClick,
}: ProgresscategorysProps) {
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
    <div className={styles.category}>
      <div className={styles.category__color}></div>
      <div className={styles.category__content}>
        <p>{`${category.name[0].toUpperCase()}${category.name.slice(1)}`}</p>

        <div className={styles.category__menu} ref={menuRef}>
          <button
            onClick={onToggle}
            className={styles.menu__btn}
            aria-controls="menu"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={
              isOpen
                ? 'Fechar mais opções de categoria'
                : 'Abrir mais opções de categoria'
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
              Deletar categoria
            </button>
            <button type="button" onClick={onUpdateClick} role="menuitem">
              Atualizar categoria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
