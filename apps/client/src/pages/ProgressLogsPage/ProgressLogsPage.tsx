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

export default function ProgressLogsPage() {
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [openLogId, setOpenLogId] = useState<string | null>(null);
  const removeLogMutation = useGoalMutations().removeLogMutation;
  const { goalId } = useParams<{ goalId: string }>();
  const {
    data: goal,
    isFetching: goalIsFetching,
    isError: goalIsError,
  } = useGoalQueries({ goalId }).idQuery;
  const {
    data: logs,
    isFetching: logsIsFetching,
    isError: logsIsError,
  } = useGoalQueries({
    goalId,
  }).logsQuery;
  const goalProgress = Math.min(
    100,
    ((goal?.currentValue ?? 0) / (goal?.targetValue ?? 1)) * 100,
  );

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenLogId(null);
      }
    };

    document.body.addEventListener('keydown', callback);

    return () => document.body.removeEventListener('keydown', callback);
  }, []);

  useEffect(() => {
    let timerId = undefined;
    if (isToastOpen) {
      timerId = setTimeout(() => setIsToastOpen(false), 5000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isToastOpen]);

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
          setIsToastOpen(true);
        },
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
            classNames={{ confirm: styles.dialog__confirm }}
          />
        )}
        {isToastOpen && (
          <Toast
            isOpen={isToastOpen}
            onClick={() => setIsToastOpen(false)}
            bgColor="#f73838ff"
            message="Erro ao tentar deletar o registro."
            ariaLive="assertive"
          />
        )}
        <section className={styles.logs}>
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
                  <span>
                    {(() => {
                      if (goal.type === 'qualitative') {
                        return goalProgress === 0
                          ? 'Não concluída'
                          : 'Concluída';
                      } else {
                        return `${goalProgress}% concluída`;
                      }
                    })()}
                  </span>
                </>
              )}
            </div>

            <hr />
          </div>

          <div className={styles.goal__logs}>
            {(() => {
              if (goalIsFetching || logsIsFetching) {
                return <Spinner />;
              }
              if (goalIsError) {
                return <p>Não foi possível achar a meta selecionada.</p>;
              }
              if (logsIsError) {
                return (
                  <p>
                    Não foi possível carregar os registros da meta selecionada.
                  </p>
                );
              }
              if ((logs?.length ?? 0) === 0) {
                return <p>Nenhum registro realizado até o momento.</p>;
              }

              return (
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
              );
            })()}
          </div>
        </section>
      </main>
    </PageView>
  );
}
