import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GoalsView.module.css';
import FokusIcon from '../../../common/Icon/Icon';
import { useCategoryQueries } from '../../../../helpers/hooks/use-category.hook';
import { useGoalQueries } from '../../../../helpers/hooks/use-goal.hook';
import Goal from '../../../common/Goal/Goal';
import Button from '../../../common/Button/Button';
import { APP_URLS } from '../../../../helpers/app.helpers';

export default function GoalsView(): JSX.Element {
  const navigate = useNavigate();
  const { data: categories, isFetched } = useCategoryQueries({}).filterQuery;
  const categoriesMap: Record<string, string> = {};
  categories?.forEach((c) => (categoriesMap[c.id] = c.name));
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { data: retGoals } = useGoalQueries({
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
        {goals?.length || 0 > 0 ? (
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
        ) : (
          <div className={styles.goals_loadingOrFetched}>
            {isFetched && goals?.length === 0 ? (
              <>
                <span>Nenhuma meta encontrada</span>
                <Button
                  onClick={() => {
                    navigate(`${APP_URLS.goals}/new`);
                  }}
                >
                  Adicione uma nova meta
                </Button>
              </>
            ) : (
              <div className={styles.goals__spinner}></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
