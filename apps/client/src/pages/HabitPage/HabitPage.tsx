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
import {
  HabitFormSchema,
  HTTPStatusCode,
  type HabitFormDTO,
} from '@fokus/shared';
import ColorPicker from '../../components/common/ColorPicker/ColorPicker';
import { type FokusIconKey } from '../../components/common/Icon/Icon';
import IconPickerField from '../../components/ui/HabitPage/IconPickerField/IconPickerField';
import Footer from '../../components/layouts/Footer/Footer';
import ProgressImpactField from '../../components/ui/HabitPage/ProgressImpactField/ProgressImpactValue';
import ReminderField from '../../components/ui/HabitPage/ReminderField/ReminderField';
import WeekDaysField from '../../components/ui/HabitPage/WeekDaysField/WeekDaysField';
import { useEffect, useMemo, useState } from 'react';
import { parseHabit } from '../../helpers/session-parse.helpers';
import Dialog from '../../components/common/Dialog/Dialog';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import FormErrorMessage from '../../components/common/FormErrorMessage/FormErrorMessage';
import Toast from '../../components/common/Toast/Toast';

const defaultHabit: HabitFormDTO = {
  title: 'Título',
  color: '#C92023',
  icon: 'music',
  type: 'qualitative',
  unitOfMeasure: null,
  reminder: null,
  progressImpactValue: 1,
  weekDays: [],
};
const date = new Date();

export default function HabitPage() {
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { habitId } = useParams<{ habitId: string }>();
  const { data: habit } = useHabitQueries({
    habitId,
    selectedDate: date,
  }).idQuery;
  const deleteMutation = useHabitMutations().deleteMutation;
  const createMutation = useHabitMutations().createMutation;
  const updateMutation = useHabitMutations().updateMutation;
  const initialHabit = useMemo(() => {
    return habit
      ? HabitFormSchema.parse(habit)
      : (parseHabit(habitId!) ?? defaultHabit);
  }, [habit]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm<HabitFormDTO>({
    resolver: zodResolver(HabitFormSchema),
    defaultValues: initialHabit,
    values: initialHabit,
  });
  const formData = useWatch({ control });

  useEffect(() => {
    document.title =
      habitId === 'new' ? 'Fokus - Novo hábito' : 'Fokus - Atualizar hábito';
  }, []);

  useEffect(() => {
    if (formData) {
      const storedKey = 'habit-data' + (habitId === 'new' ? '-new' : '-update');
      sessionStorage.setItem(storedKey, JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    let timerId = undefined;
    if (isToastOpen) {
      timerId = setTimeout(() => setIsToastOpen(false), 5000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isToastOpen]);

  const handleFormSubmit = async (data: HabitFormDTO) => {
    if ((data.weekDays ?? []).length === 0) {
      setError('weekDays', {
        message: 'Ao menos um dia da semana precisa ser escolhido.',
      });
      return;
    }

    if (habitId === 'new') {
      await createMutation.mutateAsync(data, {
        onSuccess: () => {
          sessionStorage.removeItem('habit-data-new');
          sessionStorage.removeItem('habit-data-update');
          navigate(APP_URLS.home);
        },
        onError: (err) => {
          if (err.statusCode === HTTPStatusCode.CONFLICT) {
            setError('title', { message: 'Título já registrado.' });
            return;
          }

          setIsToastOpen(true);
        },
      });
    } else {
      await updateMutation.mutateAsync(
        {
          habitId: habitId!,
          data,
          selectedDate: date,
        },
        {
          onSuccess: () => {
            sessionStorage.removeItem('habit-data-new');
            sessionStorage.removeItem('habit-data-update');
            navigate(APP_URLS.home);
          },
          onError: () => setIsToastOpen(true),
        },
      );
    }
  };

  const handleDeleteConfirmation = async (confirmation: boolean) => {
    if (!confirmation) {
      setIsDialogOpen(false);
      return;
    }

    await deleteMutation.mutateAsync(habitId!, {
      onSuccess: () => {
        sessionStorage.removeItem('habit-data-new');
        sessionStorage.removeItem('habit-data-update');
        setIsDialogOpen(false);
        navigate(APP_URLS.home);
      },
      onError: () => setIsToastOpen(true),
      onSettled: () => setIsDialogOpen(false),
    });
  };

  return (
    <PageView customBgColor="#101b14">
      <main>
        {isToastOpen && (
          <Toast
            isOpen={isToastOpen}
            onClick={() => setIsToastOpen(false)}
            message="Erro ao tentar realizar a ação."
            bgColor="#f73838ff"
            ariaLive="assertive"
          />
        )}
        {isDialogOpen && (
          <Dialog
            title="Deletar hábito"
            message="Deseja deletar o hábito? A ação não poderá ser desfeita."
            onClick={handleDeleteConfirmation}
            alertBtnText="Deletar"
            classNames={{
              root: styles.deleteBtn__root,
              cancel: styles.deleteBtn__cancel,
              confirm: styles.deleteBtn__confirm,
            }}
          />
        )}
        {createMutation.isPending && (
          <LoadingOverlay message="Criando hábito. Só um momento..." />
        )}
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

          <div
            className={styles.habit__preview}
            aria-hidden="true"
            tabIndex={-1}
          >
            <p>Pré-visualização</p>
            <Habit
              habit={{
                ...formData,
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
                aria-describedby="title-error"
              />
              <FormErrorMessage
                isHidden={!errors.title}
                message={errors.title?.message || ''}
                id="title-error"
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
                    type={formData.type!}
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
                render={({ field }) => (
                  <ReminderField
                    reminder={field.value}
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
                render={({ field }) => (
                  <WeekDaysField
                    weekDays={field.value ?? []}
                    onChange={field.onChange}
                    errors={errors}
                  />
                )}
              />
            </div>

            <div className={styles.form__submit}>
              <Button
                type="submit"
                isDisabled={
                  createMutation.isPending || updateMutation.isPending
                }
              >
                {habitId === 'new'
                  ? createMutation.isPending
                    ? 'Criando hábito...'
                    : 'Criar hábito'
                  : updateMutation.isPending
                    ? 'Atualizando hábito...'
                    : 'Atualizar hábito'}
              </Button>
            </div>
          </form>

          {habitId !== 'new' && (
            <div className={styles.habit__deleteBtn}>
              <Button
                type="button"
                isDisabled={
                  deleteMutation.isPending || updateMutation.isPending
                }
                className={styles.deleteBtn}
                onClick={() => setIsDialogOpen(true)}
              >
                {deleteMutation.isPending ? 'Deletando...' : 'Deletar hábito'}
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer customBgColor="#101b14" />
    </PageView>
  );
}
