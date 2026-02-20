import { useState, type JSX } from 'react';
import { IoMenu } from 'react-icons/io5';
import { MdAccountCircle } from 'react-icons/md';
import { MdLightMode } from 'react-icons/md';
import { MdDarkMode } from 'react-icons/md';
import styles from './MenuBar.module.css';
import Button from '../../../common/Button/Button';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { APP_URLS } from '../../../../helpers/app.helpers';
import {
  useUserMutations,
  useUserQueries,
} from '../../../../helpers/hooks/user-user.hook';

export default function MenuBar(): JSX.Element {
  const { data: user } = useUserQueries().meQuery;
  const updateMutation = useUserMutations().updateMutation;
  const [activeSidebar, setActiveSidebar] = useState<
    'navigation' | 'profile' | 'none'
  >('none');

  const onToggleThemeClick = () => {
    const theme = user?.themeMode === 'light' ? 'dark' : 'light';
    updateMutation.mutate({ themeMode: theme });
  };

  return (
    <>
      <nav className={styles.menubar}>
        <button onClick={() => setActiveSidebar('navigation')} data-sidebar="navigation">
          <IoMenu />
        </button>

        <nav
          className={clsx(
            styles.navigation,
            activeSidebar === 'navigation' && styles.navigation_open,
          )}
          data-sidebar="profile"
        >
          <div className={styles.shared__goBack}>
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
            <ul>
              <li>
                <Link to={APP_URLS.home}>Voltar para o início</Link>
              </li>
            </ul>
          </section>

          <section>
            <h3>Hábitos</h3>
            <ul>
              <li>
                <Link to={APP_URLS.habits}>Ver hábitos registrados</Link>
              </li>
              <li>
                <Link to={APP_URLS.createHabit}>Criar novo hábito</Link>
              </li>
            </ul>
          </section>

          <section>
            <h3>Metas</h3>
            <ul>
              <li>
                <Link to={APP_URLS.goals}>Ver metas registradas</Link>
              </li>
              <li>
                <Link to={APP_URLS.createGoal}>Criar nova meta</Link>
              </li>
            </ul>
          </section>
        </nav>

        <button onClick={() => setActiveSidebar('profile')} data-sidebar="profile">
          <MdAccountCircle />
        </button>

        <div
          className={clsx(
            styles.profile,
            activeSidebar === 'profile' && styles['profile_open'],
          )}
        >
          <div className={styles.shared__goBack}>
            <Button
              onClick={() => setActiveSidebar('none')}
              variant="ghost-inverse"
              isSmall
              data-sidebar={null}
            >
              Voltar
            </Button>
          </div>

          <div className={styles.profile__user}>
            <MdAccountCircle className={styles.user__img} />
            <div>
              <p className={styles.user__name}>{user?.name}</p>
              <p className={styles.user__email}>{user?.email}</p>
            </div>
          </div>

          <div className={styles.profile__theme}>
            <p>Tema:</p>
            <div className={styles.theme__toggle} onClick={onToggleThemeClick}>
              <span
                className={clsx(
                  user?.themeMode === 'light' && styles.theme_selected,
                )}
              >
                <MdLightMode />
              </span>
              <span
                className={clsx(
                  user?.themeMode === 'dark' && styles.theme_selected,
                )}
              >
                <MdDarkMode />
              </span>
            </div>
          </div>
        </div>
      </nav>
      {activeSidebar !== 'none' && <div className={styles._menubar__shadow}></div>}
    </>
  );
}
