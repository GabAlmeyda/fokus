import styles from './HabitPage.module.css';
import Button from '../../components/common/Button/Button';
import Main from '../../components/layouts/Main/Main';
import PageView from '../../components/layouts/PageView/PageView';
import Habit from '../../components/common/Habit/Habit';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useHabitMutations,
  useHabitQueries,
} from '../../helpers/hooks/use-habit.hook';
import { APP_URLS } from '../../helpers/app.helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HabitCreateSchema, type HabitCreateDTO } from '@fokus/shared';
import ColorPicker from '../../components/common/ColorPicker/ColorPicker';
import { type FokusIconKey } from '../../components/common/Icon/Icon';
import IconPicker from '../../components/ui/HabitPage/IconPicker/IconPicker';
import Input from '../../components/common/Input/Input';
import FormErrorMessage from '../../components/common/FormErrorMessage/FormErrorMessage';

const defaultHabit: Omit<HabitCreateDTO, 'userId'> = {
  title: 'Novo título',
  color: '#C92023',
  icon: 'music',
  type: 'qualitative',
  unitOfMeasure: null,
  reminder: null,
  weekDays: [],
};
const date = new Date();
const weekDays: Record<string, string> = {
  Dom: 'dom',
  Seg: 'seg',
  Ter: 'ter',
  Qua: 'qua',
  Qui: 'qui',
  Sex: 'sex',
  Sáb: 'sab',
};
const fullDayNames: Record<string, string> = {
  dom: 'aos domingo',
  seg: 'às segundas-feiras',
  ter: 'às terças-feiras',
  qua: 'às quartas-feiras',
  qui: 'às quintas-feiras',
  sex: 'às sextas-feiras',
  sab: 'aos sábados',
};

export default function HabitPage() {
  const navigate = useNavigate();
  const { habitId } = useParams<{ habitId: string }>();
  const { data } = useHabitQueries({
    habitId,
    selectedDate: date,
  }).habitQuery;
  const createMutation = useHabitMutations().createMutation;
  const habit = data
    ? HabitCreateSchema.omit({ userId: true }).parse(data)
    : defaultHabit;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(HabitCreateSchema.omit({ userId: true })),
    defaultValues: habit,
  });
  const formData = useWatch({ control });
  const habitPreview = {
    ...habit,
    ...formData,
  };

  const handleFormSubmit = async (data: Omit<HabitCreateDTO, 'userId'>) => {
    console.log(data);
    return;
    await createMutation.mutateAsync(data, {
      onSuccess: () => navigate(APP_URLS.home),
    });
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

  const handleReminderKeyDown = (event: React.KeyboardEvent) => {
    if (
      ['Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(
        event.key,
      )
    ) {
      return;
    }

    
    const val = `${(event.target as HTMLInputElement).value}${event.key}`.padStart(2, '0');
    if ((event.target as HTMLInputElement).dataset['reminder'] === 'hour') {
      if (!/^([0-1][0-9])|(2[0-3])$/.test(val)) {
        event.preventDefault();
        return;
      }

      setValue(
        'reminder',
        `${val}:${(habitPreview?.reminder as string)?.slice(3) || '00'}`,
      );
    } else {
      if (!/^[0-5][0-9]$/.test(val)) {
        event.preventDefault();
        return;
      }

      setValue(
        'reminder',
        `${(habitPreview?.reminder as string)?.slice(0, 2) || '00'}:${val}`,
      );
    }
  };

  return (
    <PageView customBgColor='#101b14'>
      <Main>
        <section className={styles.habit}>
          <span className={styles.habit__goBack}>
            <Button
              onClick={() => navigate(APP_URLS.home)}
              variant="ghost-inverse"
              isSmall
            >
              Voltar
            </Button>
          </span>

          <div className={styles.habit__preview}>
            <p>Pré-visualização</p>
            <Habit
              habit={{
                ...habitPreview,
                isCompleted: false,
              }}
              onPreviewClick={() => {}}
              onCheckClick={() => { }}
              className={styles.preview__content}
            />
            <div className={styles.preview__line}></div>
          </div>

          <form
            className={styles.habit__form}
            autoComplete="off"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            {/* TITLE FIELD */}
            <div>
              <input
                {...register('title')}
                type="text"
                placeholder="Insira o título"
                className={styles.form__title}
              />
            </div>

            {/* COLOR FIELD */}
            <div>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <ColorPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            {/* ICON FIELD */}
            <div>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <IconPicker
                    value={field.value as FokusIconKey}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* TYPE FIELD */}
            <div
              className={styles.form__typeToggle}
              role="radiogroup"
              aria-labelledby="unit-progress-label"
            >
              <p id="unit-progress-label">Unidade de progresso</p>
              <div className={styles.l_form__propToggle}>
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
                  className={
                    habitPreview.type === 'qualitative' ? styles.active : ''
                  }
                  tabIndex={0}
                  role="radio"
                  aria-checked={habitPreview.type === 'qualitative'}
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
                  className={
                    habitPreview.type === 'quantitative' ? styles.active : ''
                  }
                  tabIndex={0}
                  role="radio"
                  aria-checked={habitPreview.type === 'quantitative'}
                >
                  Sim
                </span>
              </div>

              {habitPreview.type === 'quantitative' && (
                <Controller
                  name="type"
                  control={control}
                  render={() => (
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
                />
              )}
            </div>

            {/* REMINDER FIELD */}
            <div
              className={styles.form__reminder}
              role="radiogroup"
              aria-labelledby="reminder-label"
            >
              <p id="reminder-label">Lembrete</p>
              <div className={styles.l_form__propToggle}>
                <span
                  onClick={() => {
                    setValue('reminder', null, {
                      shouldDirty: true,
                    });
                    clearErrors();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setValue('reminder', null, {
                        shouldDirty: true,
                      });
                      clearErrors();
                    }
                  }}
                  className={
                    habitPreview.reminder === null ? styles.active : ''
                  }
                  tabIndex={0}
                  role="radio"
                  aria-checked={!habitPreview.reminder}
                >
                  Não
                </span>
                <div aria-hidden="true"></div>
                <span
                  onClick={() => {
                    setValue('reminder', '', {
                      shouldDirty: true,
                    });
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setValue('reminder', '', {
                        shouldDirty: true,
                      });
                    }
                  }}
                  className={
                    habitPreview.reminder !== null ? styles.active : ''
                  }
                  tabIndex={0}
                  role="radio"
                  aria-checked={habitPreview.reminder !== null}
                >
                  Sim
                </span>
              </div>

              {habitPreview.reminder !== null && (
                <Controller
                  name="reminder"
                  control={control}
                  render={() => (
                    <div
                      className={styles.reminder__values}
                      aria-live="polite"
                      role="region"
                      aria-label="Configuração de lembrete"
                    >
                      <div>
                        <label htmlFor="reminder-hour">Horas</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="12"
                          onKeyDown={handleReminderKeyDown}
                          data-reminder="hour"
                          id="reminder-hour"
                        />
                      </div>
                      <span aria-hidden="true">:</span>
                      <div>
                        <label htmlFor="reminder-minutes">Minutos</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="30"
                          onKeyDown={handleReminderKeyDown}
                          data-reminder="min"
                          id="reminder-minutes"
                        />
                      </div>
                    </div>
                  )}
                />
              )}
            </div>

            {/* WEEK DAYS FIELD */}
            <div
              className={styles.form__weekDays}
              aria-labelledby="week-days-label"
              role="group"
            >
              <p id="week-days-label">Repetir hábitos nos dias:</p>
              <Controller
                name="weekDays"
                control={control}
                render={({ field }) => (
                  <div>
                    {Object.entries(weekDays).map(([label, day]) => {
                      const isSelected = habitPreview.weekDays.includes(
                        day as HabitCreateDTO['weekDays'][number],
                      );

                      const handleToggle = () => {
                        if (!isSelected) {
                          field.onChange([...habitPreview.weekDays, day]);
                        } else {
                          field.onChange(
                            [...habitPreview.weekDays].filter((d) => d !== day),
                          );
                        }
                      };
                      return (
                        <span
                          onClick={handleToggle}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                            } else {
                              return;
                            }

                            handleToggle();
                          }}
                          className={`${isSelected ? styles.active : ''}`}
                          key={day}
                          tabIndex={0}
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Repetir ${fullDayNames[day]}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            <div className={styles.form__submit}>
              <Button type="submit">Criar novo hábito</Button>
            </div>
          </form>
        </section>
      </Main>
    </PageView>
  );
}
