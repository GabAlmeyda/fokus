import { useEffect, useState, type JSX } from 'react';
import styles from './HomePage.module.css';
import PageView from '../../components/layouts/PageView/PageView';
import Main from '../../components/layouts/Main/Main';
import MenuBar from '../../components/ui/HomePage/MenuBar/MenuBar';
import HabitsView from '../../components/ui/HomePage/HabitsView/HabitsView';
import GoalsView from '../../components/ui/HomePage/GoalsView/GoalsView';

export default function HomePage(): JSX.Element {
  const [activeView, setActiveView] = useState<'habits' | 'goals'>('habits');

  const onViewSwitcherClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const view = (event.target as HTMLElement).dataset['view'];
    if (!view) return;

    setActiveView(view as typeof activeView);
  };

  // Changes the page title
  useEffect(() => {
    document.title = 'Fokus - Início';
  }, []);

  return (
    <PageView>
      <Main className={styles.homepage}>
        <MenuBar />
        <div
          className={styles.home__viewSwitcher}
          onClick={onViewSwitcherClick}
        >
          <button
            data-view="habits"
            className={activeView === 'habits' ? styles._selected : ''}
          >
            Hábitos
          </button>
          <span></span>
          <button
            data-view="goals"
            className={activeView === 'goals' ? styles._selected : ''}
          >
            Metas
          </button>
        </div>

        {activeView === 'habits' ? (
          <HabitsView />
        ) : activeView === 'goals' ? (
          <GoalsView></GoalsView>
        ) : (
          <div></div>
        )}
      </Main>
    </PageView>
  );
}
