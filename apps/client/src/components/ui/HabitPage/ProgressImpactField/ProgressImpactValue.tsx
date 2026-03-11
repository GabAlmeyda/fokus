import type { JSX } from 'react';
import styles from './ProgressImpactField.module.css';
import Input from '../../../common/Input/Input';
import {
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import type { HabitCreateDTO } from '@fokus/shared';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';

type Habit = Omit<HabitCreateDTO, 'userId'>;

interface ProgressImpactFieldProps {
  type: 'qualitative' | 'quantitative';
  register: UseFormRegister<Habit>;
  setValue: UseFormSetValue<Habit>;
  errors: FieldErrors<Habit>;
  clearErrors: UseFormClearErrors<Habit>;
  className?: string;
}

export default function ProgressImpactField({
  type,
  register,
  setValue,
  errors,
  clearErrors,
  className = '',
}: ProgressImpactFieldProps): JSX.Element {
  const handlePIVKeyDown = (event: React.KeyboardEvent) => {
    if (
      ['Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(
        event.key,
      )
    ) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }
  };

  return (
    <div
      className={`${styles.progressImpact__typeToggle} ${className}`}
      role="radiogroup"
      aria-labelledby="unit-progress-label"
    >
      <p id="unit-progress-label">Unidade de progresso</p>
      <div className={styles.progressImpact__propToggle}>
        <span
          onClick={() => {
            setValue('type', 'qualitative', {
              shouldDirty: true,
            });
            setValue('progressImpactValue', 1, {
              shouldDirty: true,
            });
            setValue('unitOfMeasure', null, {
              shouldDirty: true,
            });
            clearErrors();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setValue('type', 'qualitative', {
                shouldDirty: true,
              });
              setValue('progressImpactValue', 1, {
                shouldDirty: true,
              });
              setValue('unitOfMeasure', null, {
                shouldDirty: true,
              });
              clearErrors();
            }
          }}
          className={type === 'qualitative' ? styles.active : ''}
          tabIndex={0}
          role="radio"
          aria-checked={type === 'qualitative'}
        >
          Não
        </span>
        <div aria-hidden="true"></div>
        <span
          onClick={() => {
            setValue('type', 'quantitative', {
              shouldDirty: true,
            });
            setValue('progressImpactValue', undefined, {
              shouldDirty: true,
            });
            setValue('unitOfMeasure', '', {
              shouldDirty: true,
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setValue('type', 'quantitative', {
                shouldDirty: true,
              });
              setValue('progressImpactValue', undefined, {
                shouldDirty: true,
              });
              setValue('unitOfMeasure', '', {
                shouldDirty: true,
              });
            }
          }}
          className={type === 'quantitative' ? styles.active : ''}
          tabIndex={0}
          role="radio"
          aria-checked={type === 'quantitative'}
        >
          Sim
        </span>
      </div>

      {type === 'quantitative' && (
        <div
          role="region"
          aria-live="polite"
          aria-label="Configurações do progresso quantitativo"
        >
          <div className={styles.typeToggle__values}>
            <Input
              {...register('progressImpactValue')}
              onKeyDown={handlePIVKeyDown}
              type="number"
              inputMode="numeric"
              hasError={!!errors.progressImpactValue}
              placeholder="valor"
              aria-label="Valo do impacto do progresso"
              className={styles.values__input}
            />
            <Input
              {...register('unitOfMeasure')}
              type="text"
              hasError={!!errors.unitOfMeasure}
              placeholder="unidade"
              aria-label="Unidade de medida"
              className={styles.values__input}
            />
          </div>
          {(errors.progressImpactValue || errors.unitOfMeasure) && (
            <FormErrorMessage
              message={
                errors.progressImpactValue?.message ||
                errors.unitOfMeasure?.message
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
