import styles from './Goalpage.module.css';
import Button from '../../components/common/Button/Button';
import PageView from '../../components/layouts/PageView/PageView';
import Goal from '../../components/common/Goal/Goal';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGoalMutations,
  useGoalQueries,
} from '../../helpers/hooks/use-goal.hook';
import { APP_URLS } from '../../helpers/app.helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { GoalFormSchema, type GoalFormDTO } from '@fokus/shared';
import ColorPicker from '../../components/common/ColorPicker/ColorPicker';
import Footer from '../../components/layouts/Footer/Footer';
import TargetValueField from '../../components/ui/GoalPage/TargetValueField/TargetValueField';
import CategoryField from '../../components/ui/GoalPage/CategoryField/CategoryField';
import { useCategoryQueries } from '../../helpers/hooks/use-category.hook';
import DeadlineField from '../../components/ui/GoalPage/DeadlineField/DeadlineField';
import HabitField from '../../components/ui/GoalPage/HabitField/HabitField';
import { useHabitQueries } from '../../helpers/hooks/use-habit.hook';
import { useEffect, useMemo, useState } from 'react';
import { parseGoal } from '../../helpers/session-parse.helpers';
import Dialog from '../../components/common/Dialog/Dialog';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';

const defaultGoal: GoalFormDTO = {
  title: 'Título',
  color: '#8838dd',
  type: 'qualitative',
  unitOfMeasure: null,
  deadline: null,
  habitId: null,
  categoryId: null,
  targetValue: 1,
};
const selectedDate = new Date();

export default function GoalPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { goalId } = useParams<{ goalId: string }>();
  const { data: goal } = useGoalQueries({ goalId }).idQuery;
  const createMutation = useGoalMutations().createMutation;
  const updateMutation = useGoalMutations().updateMutation;
  const deleteMutation = useGoalMutations().deleteMutation;
  const initialGoal = useMemo(() => {
    return goal
      ? GoalFormSchema.parse(goal)
      : (parseGoal(goalId!) ?? defaultGoal);
  }, [goal, goalId]);
  const { data: categories } = useCategoryQueries({}).filterQuery;
  const categoriesMap: Record<string, string> = {};
  categories?.forEach((c) => (categoriesMap[c.id] = c.name));
  const { data: habits } = useHabitQueries({ selectedDate }).filterQuery;
  const habitsMap: Record<
    string,
    { title: string; color: string; unitOfMeasure: string }
  > = {};
  habits
    ?.filter((h) => h.type === 'quantitative')
    .forEach(
      (h) =>
        (habitsMap[h.id] = {
          title: h.title,
          color: h.color,
          unitOfMeasure: h.unitOfMeasure!,
        }),
    );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<GoalFormDTO>({
    resolver: zodResolver(GoalFormSchema),
    defaultValues: initialGoal,
    values: initialGoal,
  });
  const formData = useWatch({ control });

  useEffect(() => {
    document.title =
      goalId === 'new' ? 'Fokus - Nova meta' : 'Fokus - Atualizar meta';
  }, []);

  useEffect(() => {
    if (formData.type === 'qualitative' && formData.habitId != null) {
      setValue('habitId', null, { shouldDirty: true });
    }
  }, [formData.type]);

  useEffect(() => {
    if (formData) {
      const storedKey = 'goal-data' + (goalId === 'new' ? '-new' : '-update');
      sessionStorage.setItem(storedKey, JSON.stringify(formData));
    }
  }, [formData]);

  const handleFormSubmit = async (data: GoalFormDTO) => {
    if (goalId === 'new') {
      await createMutation.mutateAsync(data, {
        onSuccess: () => {
          sessionStorage.removeItem('habit-data-new');
          sessionStorage.removeItem('habit-data-update');
          navigate(APP_URLS.home);
        },
      });
    } else {
      await updateMutation.mutateAsync(
        { goalId: goalId!, newData: data },
        {
          onSuccess: () => {
            sessionStorage.removeItem('habit-data-new');
            sessionStorage.removeItem('habit-data-update');
            navigate(APP_URLS.home);
          },
        },
      );
    }
  };

  const handleHabitFieldChange = (unitOfMeasure: string | null) => {
    if (formData.type === 'qualitative') {
      setValue('type', 'quantitative', { shouldDirty: true });
      setValue('unitOfMeasure', unitOfMeasure, { shouldDirty: true });
    }
  };

  const handleDeleteConfirmation = async (confirmation: boolean) => {
    if (!confirmation) {
      setIsDialogOpen(false);
      return;
    }

    await deleteMutation.mutateAsync(goalId!, {
      onSuccess: () => {
        sessionStorage.removeItem('goal-data-new');
        sessionStorage.removeItem('goal-data-update');
        setIsDialogOpen(false);
        navigate(APP_URLS.home);
      },
      onSettled: () => setIsDialogOpen(false),
    });
  };

  return (
    <PageView customBgColor="#101b14">
      <main>
        {isDialogOpen && (
          <Dialog
            title="Deletar meta"
            message="Deseja deletar a meta? A ação não poderá ser desfeita."
            type="alert"
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
          <LoadingOverlay message="Criando meta. Só um momento..." />
        )}
        <section className={styles.goal}>
          <span className={styles.goal__goBack}>
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
            className={styles.goal__preview}
            aria-hidden="true"
            tabIndex={-1}
          >
            <p>Pré-visualização</p>
            <Goal
              goal={{
                ...formData,
                isCompleted: false,
                currentValue: 0,
                id: '',
              }}
              onPreviewClick={() => {}}
              categoryName={
                formData.categoryId ? categoriesMap[formData.categoryId] : null
              }
            />
            <div className={styles.preview__line}></div>
          </div>

          <form
            className={styles.goal__form}
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

            {/* TARGET VALUE FIELD */}
            <div>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TargetValueField
                    type={field.value ?? 'qualitative'}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>

            {/* CATEGORY FIELD */}
            <div>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <CategoryField
                    value={field.value}
                    onChange={field.onChange}
                    categoriesMap={categoriesMap}
                  />
                )}
              />
            </div>

            {/* DEADLINE FIELD */}
            <div>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => (
                  <DeadlineField
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* HABIT FIELD */}
            <div>
              <Controller
                name="habitId"
                control={control}
                render={({ field }) => (
                  <HabitField
                    value={field.value}
                    onChange={(habitId, unitOfMeasure) => {
                      handleHabitFieldChange(unitOfMeasure);
                      field.onChange(habitId);
                    }}
                    habitsMap={habitsMap}
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
                {goalId === 'new'
                  ? createMutation.isPending
                    ? 'Criando meta...'
                    : 'Criar meta'
                  : updateMutation.isPending
                    ? 'Atualizando meta...'
                    : 'Atualizar meta'}
              </Button>
            </div>
          </form>

          {goalId !== 'new' && (
            <div className={styles.goal__deleteBtn}>
              <Button
                type="button"
                isDisabled={
                  deleteMutation.isPending || updateMutation.isPending
                }
                className={styles.deleteBtn}
                onClick={() => setIsDialogOpen(true)}
              >
                {deleteMutation.isPending ? 'Deletando...' : 'Deletar meta'}
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer customBgColor="#101b14" />
    </PageView>
  );
}
