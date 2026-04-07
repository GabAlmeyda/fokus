import { useEffect, useRef, useState, type JSX } from 'react';
import styles from './Dialog.module.css';
import Button from '../Button/Button';

interface DialogProps {
  title: string;
  message: string;
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
  alertBtnText,
  onClick,
  classNames = {},
}: DialogProps): JSX.Element {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      aria-live="assertive"
      ref={dialogRef}
      onCancel={(event) => {
        if (isExecuting) {
          event.preventDefault();
        } else {
          handleClick(false);
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
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
        <>
          <Button
            onClick={() => handleClick(false)}
            className={classNames.cancel ?? ''}
            isSmall
            variant="ghost-inverse"
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
      </div>
    </dialog>
  );
}
