import { type JSX } from 'react';
import styles from './TargetValueField.module.css';
import Input from '../../../common/Input/Input';
import {
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import type { GoalFormDTO } from '@fokus/shared';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';

interface TargetValueFieldProps {
  type: 'qualitative' | 'quantitative';
  register: UseFormRegister<GoalFormDTO>;
  setValue: UseFormSetValue<GoalFormDTO>;
  errors: FieldErrors<GoalFormDTO>;
  clearErrors: UseFormClearErrors<GoalFormDTO>;
  className?: string;
}

export default function TargetValueField({
  type,
  register,
  setValue,
  errors,
  clearErrors,
  className = '',
}: TargetValueFieldProps): JSX.Element {
  const isOpen = type === 'quantitative';

  const handleTVToggle = (enabled: boolean) => {
    const typeValue = enabled ? 'quantitative' : 'qualitative';
    const targetValue = enabled ? 1 : 1;
    const unitOfMeasureValue = enabled ? '' : null;

    setValue('type', typeValue, { shouldDirty: true });
    setValue('targetValue', targetValue, { shouldDirty: true });
    setValue('unitOfMeasure', unitOfMeasureValue, { shouldDirty: true });

    if (!enabled) clearErrors();
  };

  const handleTVKeyDown = (event: React.KeyboardEvent) => {
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
      className={`${styles.targetValue} ${className}`}
      role="group"
      aria-labelledby="target-value-label"
    >
      <p id="target-value-label">Forma de medição</p>
      <button
        className={`${styles.targetValue__propToggle} ${isOpen ? styles.active : ''}`}
        type="button"
        onClick={() => handleTVToggle(!isOpen)}
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
        style={{ display: isOpen ? 'block' : 'none' }}
        id="type-values"
        role="group"
        aria-label="Configurações da meta quantitativa"
        aria-hidden={!isOpen}
      >
        <div className={styles.typeToggle__values}>
          <Input
            {...register('targetValue', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
            onKeyDown={handleTVKeyDown}
            type="number"
            inputMode="numeric"
            hasError={!!errors.targetValue}
            placeholder="valor"
            aria-label="Valor do objetivo da meta, em número"
            aria-describedby="target-error"
            className={`${styles.values__input} ${!!errors.targetValue ? styles.error : ''}`}
          />
          <Input
            {...register('unitOfMeasure')}
            type="text"
            hasError={!!errors.unitOfMeasure}
            placeholder="unidade"
            aria-label="Unidade de medida"
            aria-describedby="target-error"
            className={`${styles.values__input} ${!!errors.unitOfMeasure ? styles.error : ''}`}
          />
        </div>
        <FormErrorMessage
          id="target-error"
          isHidden={!isOpen || (!errors.targetValue && !errors.unitOfMeasure)}
          message={errors.targetValue?.message || errors.unitOfMeasure?.message}
        />
      </div>
    </div>
  );
}
