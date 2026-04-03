import { useState, type JSX } from 'react';
import styles from './ProgressImpactField.module.css';
import Input from '../../../common/Input/Input';
import {
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import type { HabitFormDTO } from '@fokus/shared';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';
import FokusIcon from '../../../common/Icon/Icon';

interface ProgressImpactFieldProps {
  type: 'qualitative' | 'quantitative';
  register: UseFormRegister<HabitFormDTO>;
  setValue: UseFormSetValue<HabitFormDTO>;
  errors: FieldErrors<HabitFormDTO>;
  clearErrors: UseFormClearErrors<HabitFormDTO>;
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
  const [isOpen, setIsOpen] = useState<boolean>(type === 'quantitative');

  const handlePIVToggle = (enabled: boolean) => {
    const typeValue = enabled ? 'quantitative' : 'qualitative';
    const progressImpactValue = 1;
    const unitOfMeasureValue = enabled ? '' : null;

    setValue('type', typeValue, { shouldDirty: true });
    setValue('progressImpactValue', progressImpactValue, { shouldDirty: true });
    setValue('unitOfMeasure', unitOfMeasureValue, { shouldDirty: true });

    setIsOpen((prev) => !prev);
    if (!enabled) clearErrors();
  };

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
      className={`${styles.progressImpact} ${className}`}
      role="group"
      aria-labelledby="unit-progress-label"
    >
      <p id="unit-progress-label">
        <span title="Cria um progresso para um hábito quantitativo">
          <FokusIcon iconKey="help" />
        </span>
        Adicionar progresso
      </p>
      <button
        className={`${styles.progressImpact__propToggle} ${isOpen ? styles.active : ''}`}
        type="button"
        onClick={() => handlePIVToggle(!isOpen)}
        aria-pressed={isOpen}
        aria-controls="type-values"
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? 'Desativar progresso para o hábito'
            : 'Ativar progresso para o hábito'
        }
      >
        <div aria-hidden="true"></div>
      </button>

      <div
        className={styles.progressImpact__valuesContainer}
        style={{ display: isOpen ? 'grid' : 'none' }}
        id="type-values"
        aria-label="Configurações do progresso quantitativo"
        aria-hidden={!isOpen}
      >
        <div className={styles.progressImpact__values}>
          <Input
            {...register('progressImpactValue', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
            onKeyDown={handlePIVKeyDown}
            type="number"
            inputMode="numeric"
            hasError={!!errors.progressImpactValue}
            placeholder="valor"
            aria-label="Valor do impacto do progresso, em número"
            aria-describedby="progress-error"
            className={`${styles.values__input} ${!!errors.progressImpactValue ? styles.error : ''}`}
          />
          <Input
            {...register('unitOfMeasure')}
            type="text"
            hasError={!!errors.unitOfMeasure}
            placeholder="unidade"
            aria-label="Unidade de medida"
            aria-describedby="progress-error"
            className={`${styles.values__input} ${!!errors.unitOfMeasure ? styles.error : ''}`}
          />
        </div>

        <FormErrorMessage
          id="progress-error"
          isHidden={
            !isOpen || (!errors.progressImpactValue && !errors.unitOfMeasure)
          }
          message={
            errors.progressImpactValue?.message || errors.unitOfMeasure?.message
          }
        />
      </div>
    </div>
  );
}
