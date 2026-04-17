import PageView from '../../components/layouts/PageView/PageView';
import styles from './CategoriesPage.module.css';
import { APP_URLS } from '../../helpers/app.helpers';
import Spinner from '../../components/common/Spinner/Spinner';
import { useEffect, useState } from 'react';
import Dialog from '../../components/common/Dialog/Dialog';
import Toast from '../../components/common/Toast/Toast';
import Button from '../../components/common/Button/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import {
  useCategoryMutations,
  useCategoryQueries,
} from '../../helpers/hooks/use-category.hook';
import CategoryForm from '../../components/ui/CategoriesPage/CategoryForm/CategoryForm';
import { HTTPStatusCode, type HTTPErrorResponse } from '@fokus/shared';
import Category from '../../components/ui/CategoriesPage/Category/Category';

export default function CategoriesPage() {
  const [categoryErros, setCategoryErrors] = useState<
    Partial<Record<'name' | 'root', { message: string }>>
  >({});
  const [categoryFormType, setCategoryFormType] = useState<
    'create' | 'update' | null
  >(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const {
    data: categories,
    isFetching: categoriesIsFetching,
    isFetched: categoriesIsFetched,
    isError: categoriesIsError,
  } = useCategoryQueries({}).filterQuery;
  const categoriesMap: Record<string, string> = {};
  categories?.forEach((c) => (categoriesMap[c.id] = c.name));
  const createMutation = useCategoryMutations().createMutation;
  const updateMutation = useCategoryMutations().updateMutation;
  const deleteMutation = useCategoryMutations().deleteMutation;

  useEffect(() => {
    document.title = 'Fokus - Categorias';
  }, []);

  useEffect(() => {
    if (!openCategoryId) return;

    const callback = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenCategoryId(null);
      }
    };

    document.body.addEventListener('keydown', callback);

    return () => document.body.removeEventListener('keydown', callback);
  }, [openCategoryId]);

  useEffect(() => {
    if (!toastMsg) return;
    const timerId = setTimeout(() => setToastMsg(null), 5000);

    return () => clearTimeout(timerId);
  }, [toastMsg]);

  const handleDeleteClick = (confirmation: boolean) => {
    if (!confirmation) {
      setOpenCategoryId(null);
      setIsDialogOpen(false);
      return;
    }

    deleteMutation.mutate(openCategoryId!, {
      onError: () => {
        setToastMsg(
          'Não foi possível remover a categoria. Que tal tentar novamente?',
        );
      },
      onSettled: () => {
        setIsDialogOpen(false);
        setOpenCategoryId(null);
      },
    });
  };

  const handleFormSubmit = (data: { name: string }) => {
    if (categoryFormType === 'create') {
      createMutation.mutate(data, {
        onError: (error: HTTPErrorResponse) => {
          if (error.statusCode === HTTPStatusCode.CONFLICT) {
            setCategoryErrors((prev) => ({
              ...prev,
              name: { message: 'Nome já registrado' },
            }));
            return;
          }
          setToastMsg(
            'Não foi possível adicionar a categoria. Que tal tentar novamente?',
          );
        },
        onSuccess: () => setCategoryFormType(null),
        onSettled: () => {
          setIsDialogOpen(false);
          setOpenCategoryId(null);
        },
      });
    } else {
      updateMutation.mutate(
        { categoryId: openCategoryId!, newData: data },
        {
          onError: (error: HTTPErrorResponse) => {
            if (error.statusCode === HTTPStatusCode.CONFLICT) {
              setCategoryErrors((prev) => ({
                ...prev,
                name: { message: 'Nome já registrado' },
              }));
              return;
            }
            setToastMsg(
              'Não foi possível atualizar a categoria. Que tal tentar novamente?',
            );
          },
          onSuccess: () => setCategoryFormType(null),
          onSettled: () => {
            setIsDialogOpen(false);
            setOpenCategoryId(null);
          },
        },
      );
    }
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
          if (createMutation.isPending) {
            return (
              <LoadingOverlay
                message="Criando categoria. Só um momento..."
                className={styles.loadingOverlay}
              />
            );
          } else if (updateMutation.isPending) {
            <LoadingOverlay
              message="Atualizando categoria. Só um momento..."
              className={styles.loadingOverlay}
            />;
          } else if (deleteMutation.isPending) {
            return (
              <LoadingOverlay
                message="Removendo categoria. Só um momento..."
                className={styles.loadingOverlay}
              />
            );
          }
        })()}
        <section className={styles.categories}>
          {!!categoryFormType && (
            <CategoryForm
              onCloseClick={() => setCategoryFormType(null)}
              onSubmit={handleFormSubmit}
              isPending={createMutation.isPending}
              errors={categoryErros}
              oldValues={
                categoryFormType === 'update'
                  ? { name: categoriesMap[openCategoryId!] }
                  : undefined
              }
            />
          )}
          <span className={styles.categories__goBack}>
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
          <div className={styles.categories__top}>
            <h2>Suas categorias</h2>

            <Button
              className={styles.top__btn}
              onClick={() => setCategoryFormType('create')}
            >
              Adicionar nova categoria
            </Button>

            <hr />
          </div>

          <div className={styles.categories__container}>
            {categoriesIsError && (
              <div className={styles.categories__msg}>
                <p className={styles.error}>
                  Aconteceu um erro e não foi possível carregar suas categorias.
                </p>
              </div>
            )}

            {!categoriesIsError && categoriesIsFetching && !categories && (
              <Spinner />
            )}

            {!categoriesIsError &&
              categoriesIsFetched &&
              !categoriesIsFetching &&
              !categories?.length && (
                <div className={styles.categories__msg}>
                  <p>Nenhuma categoria registrada.</p>
                </div>
              )}

            {!categoriesIsError && !!categories?.length && (
              <div className={styles.categories__items}>
                {categories?.map((c) => (
                  <Category
                    category={c}
                    isOpen={openCategoryId === c.id}
                    onToggle={() => {
                      setOpenCategoryId((prev) => {
                        if (!prev || prev !== c.id || !!categoryFormType) {
                          return c.id;
                        }

                        return null;
                      });
                    }}
                    onDeleteClick={() => {
                      setIsDialogOpen(true);
                    }}
                    onUpdateClick={() => {
                      setCategoryFormType('update');
                    }}
                    key={`category-${c.id}`}
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
