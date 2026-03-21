import { useEffect, useRef, useState, type JSX } from 'react';
import styles from './Dialog.module.css';
import Button from '../Button/Button';

interface DialogProps {
  title: string;
  message: string;
  type: 'warning' | 'alert';
  alertBtnText?: string;
  onClick: (confirmation: boolean) => void;
  classNames?: {
    root?: string;
    confirm?: string;
    cancel?: string;
  };
}

export default function Dialog({
  title,
  message,
  type,
  alertBtnText,
  onClick,
  classNames = {},
}: DialogProps): JSX.Element {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isAlert = type === 'alert';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      setIsExecuting(false);

      dialog.close();
      document.body.style.overflow = '';
    };
  }, []);

  const handleClick = (confirmation: boolean) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    setIsExecuting(true);
    document.body.style.overflow = '';
    onClick(confirmation);
  };

  return (
    <dialog
      className={`${styles.dialog} ${classNames.root ?? ''}`}
      aria-live={type === 'warning' ? 'polite' : 'assertive'}
      ref={dialogRef}
      onCancel={(event) => {
        if (isExecuting) {
          event.preventDefault();
        } else {
          handleClick(false);
        }
      }}
    >
      <h2 className={styles.dialog__title}>{title}</h2>
      <hr />
      <p className={styles.dialog__message}>{message}</p>

      <div
        aria-hidden="true"
        className={`${styles.dialog__loader} ${isExecuting ? styles.loading : ''}`}
      >
        <span></span>
      </div>

      <div className={styles.dialog__btns}>
        {isAlert ? (
          <>
            <Button
              onClick={() => handleClick(false)}
              className={classNames.cancel ?? ''}
              isSmall
              isDisabled={isExecuting}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => handleClick(true)}
              className={classNames.confirm ?? ''}
              isSmall
              isDisabled={isExecuting}
            >
              {alertBtnText}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => handleClick(true)}
            className={classNames.confirm ?? ''}
            isSmall
            isDisabled={isExecuting}
          >
            Confirmar
          </Button>
        )}
      </div>
    </dialog>
  );
}
