import { useParams } from 'react-router-dom';
import PageView from '../../components/layouts/PageView/PageView';
import styles from './ProgressLogsPage.module.css';
import { APP_URLS } from '../../helpers/app.helpers';
import {
  useGoalMutations,
  useGoalQueries,
} from '../../helpers/hooks/use-goal.hook';
import Spinner from '../../components/common/Spinner/Spinner';
import ProgressLog from '../../components/ui/ProgressLogsPage/ProgressLog/ProgressLog';
import { useEffect, useState } from 'react';
import Dialog from '../../components/common/Dialog/Dialog';
import Toast from '../../components/common/Toast/Toast';
import Button from '../../components/common/Button/Button';
import ProgressLogForm from '../../components/ui/ProgressLogsPage/ProgressLogForm/ProgressLogForm';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';

export default function ProgressLogsPage() {
  const [isNewLogOpen, setIsNewLogOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [openLogId, setOpenLogId] = useState<string | null>(null);
  const addLogMutation = useGoalMutations().addLogMutation;
  const removeLogMutation = useGoalMutations().removeLogMutation;
  const { goalId } = useParams<{ goalId: string }>();
  const { data: goal, isError: goalIsError } = useGoalQueries({
    goalId,
  }).idQuery;
  const {
    data: logs,
    isFetching: logsIsFetching,
    isFetched: logsIsFetched,
    isError: logsIsError,
    refetch: logsRefetch,
  } = useGoalQueries({
    goalId,
  }).logsQuery;
  const goalProgress = Math.min(
    100,
    ((goal?.currentValue ?? 0) / (goal?.targetValue ?? 1)) * 100,
  );

  useEffect(() => {
    document.title = 'Fokus - Registros';
  }, []);

  useEffect(() => {
    if (!openLogId) return;

    const callback = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenLogId(null);
      }
    };

    document.body.addEventListener('keydown', callback);

    return () => document.body.removeEventListener('keydown', callback);
  }, [openLogId]);

  useEffect(() => {
    if (!toastMsg) return;
    const timerId = setTimeout(() => setToastMsg(null), 5000);

    return () => clearTimeout(timerId);
  }, [toastMsg]);

  const handleDeleteClick = (confirmation: boolean) => {
    if (!confirmation) {
      setOpenLogId(null);
      setIsDialogOpen(false);
      return;
    }

    removeLogMutation.mutate(
      {
        progressLogId: openLogId!,
        goalId: goal!.id,
      },
      {
        onError: () => {
          setToastMsg('Erro ao tentar remover o registro');
        },
        onSettled: () => {
          setIsDialogOpen(false);
          setOpenLogId(null);
        },
      },
    );
  };

  const handleFormSubmit = (data: { value: number; date: Date }) => {
    addLogMutation.mutate(
      { ...data, goalId: goalId! },
      {
        // TODO: specify the error to the user
        onError: () => {
          setToastMsg('Erro ao tentar adicionar o registro');
        },
        onSuccess: () => setIsNewLogOpen(false),
        onSettled: () => {
          setIsDialogOpen(false);
          setOpenLogId(null);
        },
      },
    );
  };

  return (
    <PageView>
      <main>
        {isDialogOpen && (
          <Dialog
            title="Deletar registro"
            message="Deseja deletar o registro? Isso afetará a meta e o hábito relacionado. A ação não poderá ser desfeita."
            alertBtnText="Deletar"
            onClick={handleDeleteClick}
            classNames={{
              root: styles.dialog__root,
              cancel: styles.dialog__cancel,
              confirm: styles.dialog__confirm,
            }}
          />
        )}
        {toastMsg && (
          <Toast
            isOpen={!!toastMsg}
            onClick={() => setToastMsg(null)}
            bgColor="#f73838ff"
            message={toastMsg}
            ariaLive="assertive"
          />
        )}
        {(() => {
          if (addLogMutation.isPending) {
            return (
              <LoadingOverlay message="Criando registro. Só um momento..." />
            );
          } else if (removeLogMutation.isPending) {
            return (
              <LoadingOverlay message="Removendo registro. Só um momento..." />
            );
          }
        })()}
        <section className={styles.logs}>
          {isNewLogOpen && (
            <ProgressLogForm
              onCloseClick={() => setIsNewLogOpen(false)}
              onSubmit={handleFormSubmit}
              isPending={addLogMutation.isPending}
            />
          )}
          <span className={styles.logs__goBack}>
            <Button
              variant="ghost-inverse"
              isLink
              to={APP_URLS.home}
              isSmall
              className={styles.goBack__btn}
            >
              Voltar
            </Button>
          </span>
          <div className={styles.logs__goal}>
            <div className={styles.goal__title}>
              <p>Registros da meta</p>
              {goalIsError && (
                <p aria-live="assertive" className={styles.error}>
                  Erro ao carregar informações da meta.
                </p>
              )}
              {!!goal && <strong>{goal.title}</strong>}
            </div>

            <div className={styles.goal__progress}>
              {!!goal && (
                <>
                  <div>
                    <span
                      style={{
                        minWidth: `${goalProgress}%`,
                      }}
                    ></span>
                  </div>
                  <p>
                    {(() => {
                      if (goal.type === 'qualitative') {
                        return goalProgress === 0
                          ? 'Não concluída'
                          : 'Concluída';
                      } else {
                        return (
                          <>
                            {`${goalProgress}% concluída`}{' '}
                            <span className={styles.progress__dot}></span>
                            {`${goal.currentValue}/${goal.targetValue}`}{' '}
                            <span className={styles.progress__unitOfMeasure}>
                              {goal.unitOfMeasure?.toLowerCase()}
                            </span>
                          </>
                        );
                      }
                    })()}
                  </p>
                </>
              )}
            </div>

            <Button
              className={styles.goal__btn}
              onClick={() => setIsNewLogOpen(true)}
            >
              Adicionar novo registro
            </Button>

            <hr />
          </div>

          <div className={styles.logs__container}>
            {logsIsError && (
              <div className={styles.logs__msg}>
                <p className={styles.error}>
                  Aconteceu um erro e não foi possível carregar os registros.
                </p>
              </div>
            )}

            {!goalIsError && !logsIsFetching && logsIsError && (
              <div className={styles.logs__msg}>
                <p>
                  Não foi possível carregar os registros da meta selecionada.
                </p>
                <Button onClick={() => logsRefetch()}>Tentar novamente</Button>
              </div>
            )}

            {!goalIsError && logsIsFetching && !logs && <Spinner />}

            {!goalIsError &&
              logsIsFetched &&
              !logsIsFetching &&
              !logsIsError &&
              !logs?.length && (
                <div className={styles.logs__msg}>
                  <p>Nenhum registro criado.</p>
                </div>
              )}

            {!goalIsError && !!logs?.length && (
              <div className={styles.logs__items}>
                {logs?.map((l) => (
                  <ProgressLog
                    log={l}
                    unitOfMeasure={goal?.unitOfMeasure}
                    isOpen={openLogId === l.id}
                    onToggle={() => {
                      setOpenLogId((prev) => {
                        if (!prev || prev !== l.id) {
                          return l.id;
                        }

                        return null;
                      });
                    }}
                    onDeleteClick={() => {
                      setIsDialogOpen(true);
                    }}
                    key={`log-${l.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </PageView>
  );
}
