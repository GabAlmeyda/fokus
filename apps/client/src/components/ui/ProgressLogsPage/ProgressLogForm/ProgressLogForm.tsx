import { Controller, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { ptBR } from 'date-fns/locale';
import Button from '../../../common/Button/Button';
import styles from './ProgressLogForm.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../../common/Input/Input';
import { DayPicker } from 'react-day-picker';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';
import { format } from 'date-fns';
import FokusIcon from '../../../common/Icon/Icon';

const ProgressLogSchema = z.object({
  value: z.number('Um número precisa ser passado'),
  date: z.coerce.date().transform((val) => {
    const d = val.toISOString().split('T')[0];
    return new Date(d + 'T12:00:00Z');
  }),
});
type ProgressLogDTO = z.infer<typeof ProgressLogSchema>;

const date = new Date();

interface ProgressLogFormProps {
  onCloseClick: () => void;
  onSubmit: (data: { value: number; date: Date }) => void;
  isPending?: boolean;
}

export default function ProgressLogForm({
  onCloseClick,
  onSubmit,
  isPending = false,
}: ProgressLogFormProps) {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<ProgressLogDTO>({
    defaultValues: {
      value: undefined,
      date,
    },
    resolver: zodResolver(ProgressLogSchema) as any,
  });
  const formDateValue = useWatch({ control, name: 'date' });

  const handleValueKeyDown = (event: React.KeyboardEvent) => {
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
    <>
      <div className={styles.newLog}>
        <span className={styles.newLog__goBack}>
          <Button
            variant="ghost-inverse"
            isSmall
            onClick={onCloseClick}
            className={styles.goBack__btn}
          >
            Voltar
          </Button>
        </span>
        <h2>Novo registro</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className={styles.newLog__form}
        >
          <div>
            <label htmlFor="log-value">Valor do novo registro</label>
            <Input
              {...register('value', {
                setValueAs: (v) => (v === '' ? undefined : Number(v)),
              })}
              onKeyDown={handleValueKeyDown}
              type="number"
              inputMode="numeric"
              hasError={!!errors.value}
              placeholder="valor"
              aria-describedby="value-error"
              id="log-value"
            />
            <FormErrorMessage
              id="value-error"
              isHidden={!errors.value}
              message={errors.value?.message}
            />
          </div>

          <div>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <>
                  <label htmlFor="log-date">
                    Data do registro{' '}
                    <span>
                      <FokusIcon iconKey="calendar" />
                      {format(formDateValue, 'dd/MM/yyyy')}
                    </span>
                  </label>
                  <DayPicker
                    id="log-date"
                    mode="single"
                    disabled={{ after: date }}
                    selected={field.value || undefined}
                    onSelect={(value) => {
                      field.onChange(value);
                    }}
                    locale={ptBR}
                    required={true}
                    classNames={{
                      root: styles.date__container,
                      months: styles.date__months,
                      nav: styles.date__nav,
                      month_grid: styles.date__monthGrid,
                      month_caption: styles.date__monthCaption,
                      weeks: styles.date__weeks,
                      selected: styles.date__selected,
                      today: styles.date__today,
                      day: styles.date__day,
                      disabled: styles.date__disabled,
                      chevron: styles.date__chevron,
                    }}
                  />
                </>
              )}
            />
          </div>

          <div className={styles.form__btn}>
            <Button type="submit" isDisabled={isPending}>
              {isPending ? 'Adicionando registro...' : 'Adicionar registro'}
            </Button>
          </div>
        </form>
      </div>
      <div className={styles._newLog__shadow} onClick={onCloseClick}></div>
    </>
  );
}
