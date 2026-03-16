import styles from './HabitPage.module.css';
import Button from '../../components/common/Button/Button';
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
import IconPickerField from '../../components/ui/HabitPage/IconPickerField/IconPickerField';
import Footer from '../../components/layouts/Footer/Footer';
import ProgressImpactField from '../../components/ui/HabitPage/ProgressImpactField/ProgressImpactValue';
import ReminderField from '../../components/ui/HabitPage/ReminderField/ReminderField';
import WeekDaysField from '../../components/ui/HabitPage/WeekDaysField/WeekDaysField';
import { useEffect } from 'react';

const defaultHabit: Omit<HabitCreateDTO, 'userId'> = {
  title: 'Novo título',
  color: '#C92023',
  icon: 'music',
  type: 'qualitative',
  unitOfMeasure: null,
  reminder: null,
  progressImpactValue: 0,
  weekDays: [],
};
const date = new Date();

export default function HabitPage() {
  const navigate = useNavigate();
  const { habitId } = useParams<{ habitId: string }>();
  const { data } = useHabitQueries({
    habitId,
    selectedDate: date,
  }).idQuery;
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
  } = useForm<Omit<HabitCreateDTO, 'userId'>>({
    resolver: zodResolver(HabitCreateSchema.omit({ userId: true }) as any),
    defaultValues: habit,
  });
  const formData = useWatch({ control });
  const habitPreview = {
    ...habit,
    ...formData,
  };

  useEffect(() => {
    document.title =
      habitId === 'new' ? 'Fokus - Novo hábito' : 'Fokus - Atualizar hábito';
  }, []);

  const handleFormSubmit = async (data: Omit<HabitCreateDTO, 'userId'>) => {
    await createMutation.mutateAsync(data, {
      onSuccess: () => navigate(APP_URLS.home),
    });
  };

  return (
    <PageView customBgColor="#101b14">
      <main>
        <section className={styles.habit}>
          <span className={styles.habit__goBack}>
            <Button
              onClick={() => navigate(APP_URLS.home)}
              variant="ghost-inverse"
              isSmall
              className={styles.goBack__btn}
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
              onCheckClick={() => {}}
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
                  <IconPickerField
                    value={field.value as FokusIconKey}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* TYPE FIELD */}
            <div>
              <Controller
                name="type"
                control={control}
                render={() => (
                  <ProgressImpactField
                    type={habitPreview.type}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>

            {/* REMINDER FIELD */}
            <div>
              <Controller
                name="reminder"
                control={control}
                render={() => (
                  <ReminderField
                    reminder={habitPreview.reminder}
                    setValue={setValue}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>

            {/* WEEK DAYS FIELD */}
            <div>
              <Controller
                name="weekDays"
                control={control}
                render={({ field: { onChange } }) => (
                  <WeekDaysField
                    weekDays={habitPreview.weekDays}
                    onChange={onChange}
                  />
                )}
              />
            </div>

            <div className={styles.form__submit}>
              <Button type="submit">Criar novo hábito</Button>
            </div>
          </form>
        </section>
      </main>
      <Footer customBgColor="#101b14" />
    </PageView>
  );
}
