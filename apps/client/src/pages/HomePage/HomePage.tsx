import { useEffect, useState, type JSX } from 'react';
import styles from './HomePage.module.css';
import PageView from '../../components/layouts/PageView/PageView';
import MenuBar from '../../components/ui/HomePage/MenuBar/MenuBar';
import HabitsView from '../../components/ui/HomePage/HabitsView/HabitsView';
import GoalsView from '../../components/ui/HomePage/GoalsView/GoalsView';
import Footer from '../../components/layouts/Footer/Footer';
import type { HTTPErrorResponse } from '@fokus/shared';
import Toast from '../../components/common/Toast/Toast';

export default function HomePage(): JSX.Element {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'habits' | 'goals'>(
    (sessionStorage.getItem('active-view') as 'habits' | 'goals') ?? 'habits',
  );

  useEffect(() => {
    document.title = 'Fokus - Início';
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timerId = setTimeout(() => setToastMsg(null), 5000);

    return () => clearTimeout(timerId);
  }, [toastMsg]);

  const handleViewSwitcherClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const view = (event.target as HTMLElement).dataset['view'];
    if (!view) return;

    setActiveView(view as typeof activeView);
    sessionStorage.setItem('active-view', view);
  };

  const handleHabitReqError = (
    _: HTTPErrorResponse,
    action: 'check' | 'uncheck',
  ) => {
    if (action === 'check') {
      setToastMsg(
        'Não foi possível marcar o hábito como concluído. Que tal tentar novamente?',
      );
    } else {
      setToastMsg(
        'Não foi possível desmarcar o hábito concluído. Que tal tentar novamente?',
      );
    }
  };

  const handleCategoryReqError = (_: HTTPErrorResponse) => {
    setToastMsg(
      'Não foi possível carregar suas categorias. Que tal tentar novamente?',
    );
  };

  return (
    <PageView cssBgType="primary">
      <main className={styles.homepage}>
        <section>
          {toastMsg && (
            <Toast
              message={toastMsg}
              bgColor="#f73838ff"
              isOpen={!!toastMsg}
              ariaLive="assertive"
              onClick={() => setToastMsg(null)}
            />
          )}
          <MenuBar />
          <div
            className={styles.home__viewSwitcher}
            onClick={handleViewSwitcherClick}
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
            <HabitsView onReqError={handleHabitReqError} />
          ) : activeView === 'goals' ? (
            <GoalsView onCategoryReqError={handleCategoryReqError}></GoalsView>
          ) : (
            <div></div>
          )}
        </section>
      </main>
      <Footer customBgColor="var(--bg-inverse)" />
    </PageView>
  );
}
