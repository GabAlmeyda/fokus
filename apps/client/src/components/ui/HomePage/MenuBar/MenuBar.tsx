import { useEffect, useState, type JSX } from 'react';
import styles from './MenuBar.module.css';
import Button from '../../../common/Button/Button';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { APP_URLS } from '../../../../helpers/app.helpers';
import {
  useUserMutations,
  useUserQueries,
} from '../../../../helpers/hooks/use-user.hook';
import FokusIcon from '../../../common/Icon/Icon';
import Toast from '../../../common/Toast/Toast';

export default function MenuBar(): JSX.Element {
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const { data: user } = useUserQueries().meQuery;
  const updateMutation = useUserMutations().updateMutation;
  const [activeSidebar, setActiveSidebar] = useState<
    'navigation' | 'aside' | 'none'
  >('none');

  useEffect(() => {
    let timerId = undefined;
    if (isToastOpen) {
      timerId = setTimeout(() => setIsToastOpen(false), 5000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isToastOpen]);

  const handleToggleThemeClick = () => {
    const theme = user?.themeMode === 'light' ? 'dark' : 'light';
    updateMutation.mutate(
      { themeMode: theme },
      {
        onError: () => setIsToastOpen(true),
      },
    );
  };

  return (
    <>
      {isToastOpen && (
        <Toast
          message="Erro ao atualizar dados da conta."
          bgColor="#f73838ff"
          ariaLive="assertive"
        />
      )}
      <nav className={styles.menubar}>
        <button
          onClick={() => setActiveSidebar('navigation')}
          data-sidebar="navigation"
        >
          <FokusIcon iconKey="menu" />
        </button>

        <nav
          className={clsx(
            styles.navigation,
            activeSidebar === 'navigation' && styles.open,
          )}
          data-sidebar="profile"
        >
          <div className={styles.l_menubar__goBack}>
            <Button
              onClick={() => setActiveSidebar('none')}
              variant="ghost-inverse"
              isSmall
              data-sidebar={null}
            >
              Voltar
            </Button>
          </div>

          <section>
            <h3>Início</h3>
            <ul className={styles.l_menubar__list}>
              <li>
                <Link to={APP_URLS.home}>
                  <span>Voltar para o início</span>
                  <FokusIcon iconKey="big-right" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h3>Criar</h3>
            <ul className={styles.l_menubar__list}>
              <li>
                <Link to={`${APP_URLS.habits}/new`}>
                  <span>Criar novo hábito</span>{' '}
                  <FokusIcon iconKey="big-right" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link to={`${APP_URLS.goals}/new`}>
                  <span>Criar nova meta</span>
                  <FokusIcon iconKey="big-right" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </section>
        </nav>

        <button onClick={() => setActiveSidebar('aside')} data-sidebar="aside">
          <FokusIcon iconKey="user" />
        </button>

        <div
          className={clsx(
            styles.aside,
            activeSidebar === 'aside' && styles.open,
          )}
        >
          <div className={styles.l_menubar__goBack}>
            <Button
              onClick={() => setActiveSidebar('none')}
              variant="ghost-inverse"
              isSmall
              data-sidebar={null}
            >
              Voltar
            </Button>
          </div>

          <section className={styles.aside__user}>
            <div className={styles.user__container}>
              <FokusIcon iconKey="user" className={styles.user__img} />
              <div>
                <p className={styles.user__name}>{user?.name}</p>
                <p className={styles.user__email}>{user?.email}</p>
              </div>
            </div>

            <div className={styles.user__theme}>
              <p>Tema:</p>
              <div
                className={styles.theme__toggle}
                onClick={handleToggleThemeClick}
              >
                <span
                  className={clsx(
                    user?.themeMode === 'light' && styles.theme_selected,
                  )}
                >
                  <FokusIcon iconKey="sun" />
                </span>
                <span
                  className={clsx(
                    user?.themeMode === 'dark' && styles.theme_selected,
                  )}
                >
                  <FokusIcon iconKey="moon" />
                </span>
              </div>
            </div>
          </section>

          <section className={styles.aside__contact}>
            <h3>Entre em contato</h3>
            <ul className={styles.l_menubar__list}>
              <li>
                <a href="https://www.instagram.com/almeyda.dev/" target="_blank">
                  <span>
                    <FokusIcon iconKey="instagram" aria-hidden="true" />
                    Instagram
                  </span>
                  <FokusIcon iconKey="big-right" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/gabriel-almeyda/" target="_blank">
                  <span>
                    <FokusIcon iconKey="linkedin" aria-hidden="true" />
                    LinkedIn
                  </span>
                  <FokusIcon iconKey="big-right" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="https://gabalmeyda.vercel.app" target="_blank">
                  <span>
                    <FokusIcon iconKey="website" aria-hidden="true" />
                    Portfólio
                  </span>
                  <FokusIcon iconKey="big-right" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </section>
        </div>
      </nav>
      {activeSidebar !== 'none' && (
        <div
          className={styles._menubar__shadow}
          onClick={() => setActiveSidebar('none')}
        ></div>
      )}
    </>
  );
}
