import { useState, type JSX } from 'react';
import styles from './MenuBar.module.css';
import Button from '../../../common/Button/Button';
import { Link } from 'react-router-dom';
import { APP_URLS } from '../../../../helpers/app.helpers';
import FokusIcon from '../../../common/Icon/Icon';
import Aside from '../Aside/Aside';

export default function MenuBar(): JSX.Element {
  const [activeSidebar, setActiveSidebar] = useState<
    'navigation' | 'aside' | 'none'
  >('none');

  return (
    <>
      <nav className={styles.menubar}>
        <button onClick={() => setActiveSidebar('navigation')}>
          <FokusIcon iconKey="menu" />
        </button>

        <div
          className={`${styles.navigation} ${activeSidebar === 'navigation' ? styles.open : ''}`}
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
        </div>

        <button onClick={() => setActiveSidebar('aside')} data-sidebar="aside">
          <FokusIcon iconKey="user" />
        </button>
        {activeSidebar === 'aside' && (
          <Aside onCloseClick={() => setActiveSidebar('none')} />
        )}
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
