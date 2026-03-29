import { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GoalsView.module.css';
import FokusIcon from '../../../common/Icon/Icon';
import { useCategoryQueries } from '../../../../helpers/hooks/use-category.hook';
import { useGoalQueries } from '../../../../helpers/hooks/use-goal.hook';
import Goal from '../../../common/Goal/Goal';
import Button from '../../../common/Button/Button';
import { APP_URLS } from '../../../../helpers/app.helpers';
import Spinner from '../../../common/Spinner/Spinner';
import type { HTTPErrorResponse } from '@fokus/shared';

interface GoalsViewProps {
  onCategoryReqError: (error: HTTPErrorResponse) => void;
}

export default function GoalsView({
  onCategoryReqError,
}: GoalsViewProps): JSX.Element {
  const navigate = useNavigate();
  const { data: categories, error: categoryError } = useCategoryQueries(
    {},
  ).filterQuery;
  const categoriesMap: Record<string, string> = {};
  categories?.forEach((c) => (categoriesMap[c.id] = c.name));
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const {
    data: retGoals,
    isFetching,
    isFetched,
    error,
    refetch,
  } = useGoalQueries({
    filter: {
      categoryId: !['all', 'no-tag'].includes(activeCategory)
        ? activeCategory
        : undefined,
    },
  }).filterQuery;
  const goals =
    activeCategory === 'no-tag'
      ? retGoals?.filter((g) => !g.categoryId)
      : retGoals;

  useEffect(() => {
    if (categoryError) {
      onCategoryReqError(categoryError);
    }
  }, [categoryError]);

  const handleCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const query = (event.currentTarget as HTMLElement).dataset[
      'category'
    ] as string;
    setActiveCategory(query);
  };

  return (
    <div className={styles.goalsView}>
      <div className={styles.header}>
        <span>
          <FokusIcon iconKey="filter" /> Filtros
        </span>
        <div
          className={styles.header__filters}
          role="group"
          aria-label="Filtros de metas"
          aria-controls="goals"
        >
          <button
            onClick={handleCategoryClick}
            data-category="all"
            className={activeCategory === 'all' ? styles['active'] : ''}
          >
            Todas
          </button>
          <button
            onClick={handleCategoryClick}
            data-category="no-tag"
            className={activeCategory === 'no-tag' ? styles['active'] : ''}
          >
            Sem tags
          </button>
          {categories?.map((c) => (
            <button
              onClick={handleCategoryClick}
              className={activeCategory === c.id ? styles['active'] : ''}
              data-category={c.id}
              key={`category-${c.id}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.goals} id="goals">
        {!isFetching && error && (
          <div className={styles.goals__msg}>
            <p className={styles.error}>Aconteceu um erro ao tentar retornar suas metas</p>
            <Button onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        )}

        {isFetching && !goals && <Spinner />}

        {isFetched && !isFetching && !error && !goals?.length && (
          <div className={styles.goals__msg}>
            <p>Nenhuma meta encontrada.</p>
            <Button
              onClick={() => {
                navigate(`${APP_URLS.goals}/new`);
              }}
            >
              Adicione uma nova meta
            </Button>
          </div>
        )}

        {!!goals?.length && (
          <>
            <div className={styles.goals__completed}>
              {goals
                ?.filter((g) => !g.isCompleted)
                .map((g) => (
                  <Goal
                    categoryName={
                      g.categoryId ? categoriesMap[g.categoryId] : null
                    }
                    goal={g}
                    onPreviewClick={() => navigate(`${APP_URLS.goals}/${g.id}`)}
                    key={`goal-${g.id}`}
                  ></Goal>
                ))}
            </div>
            <div className={styles.goals__uncompleted}>
              {goals
                ?.filter((g) => g.isCompleted)
                .map((g) => (
                  <Goal
                    categoryName={
                      g.categoryId ? categoriesMap[g.categoryId] : null
                    }
                    goal={g}
                    onPreviewClick={() => navigate(`${APP_URLS.goals}/${g.id}`)}
                    key={`goal-${g.id}`}
                  ></Goal>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
