import { useEffect, useState, type JSX } from 'react';
import styles from './MenuBar.module.css';
import Button from '../../../common/Button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../../../helpers/app.helpers';
import {
  useUserMutations,
  useUserQueries,
} from '../../../../helpers/hooks/use-user.hook';
import FokusIcon from '../../../common/Icon/Icon';
import Toast from '../../../common/Toast/Toast';
import Dialog from '../../../common/Dialog/Dialog';

export default function MenuBar(): JSX.Element {
  const navigate = useNavigate();
  const [dialogConfig, setDialogConfig] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { data: user } = useUserQueries().meQuery;
  const updateMutation = useUserMutations().updateMutation;
  const logoutMutation = useUserMutations().logoutMutation;
  const deleteMutation = useUserMutations().deleteMutation;
  const [activeSidebar, setActiveSidebar] = useState<
    'navigation' | 'aside' | 'none'
  >('none');

  useEffect(() => {
    let timerId = undefined;
    if (toastMsg) {
      timerId = setTimeout(() => setToastMsg(null), 5000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [toastMsg]);

  const handleToggleThemeClick = () => {
    const theme = user?.themeMode === 'light' ? 'dark' : 'light';
    updateMutation.mutate(
      { themeMode: theme },
      {
        onError: () => setToastMsg('Erro ao tentar atualizar dados da conta.'),
      },
    );
  };

  const handleAccountBtnsClick = (event: React.MouseEvent) => {
    const element = event.target as HTMLButtonElement;
    if (!element) return;

    if (element.dataset.action === 'logout') {
      setDialogConfig({
        title: 'Desconectar da sua conta',
        message: 'Deseja desconectar da sua conta agora?',
        alertBtnText: 'Desconectar',
        onClick: (confirmation: boolean) =>
          handleAccountBtnsConfirmation('logout', confirmation),
      });
    } else if (element.dataset.action === 'delete') {
      setDialogConfig({
        title: 'Deletar sua conta',
        message:
          'Deseja deletar sua conta? Isso apagará todos os seus dados registrados.',
        alertBtnText: 'Deletar',
        onClick: (confirmation: boolean) =>
          handleAccountBtnsConfirmation('delete', confirmation),
        classNames: {
          root: styles.dialog__root,
          cancel: styles.dialog__deleteCancel,
          confirm: styles.dialog__deleteConfirm,
        },
      });
    }
  };

  const handleAccountBtnsConfirmation = (
    action: 'logout' | 'delete',
    confirmation: boolean,
  ) => {
    if (!confirmation) {
      setDialogConfig(null);
      return;
    }

    if (action === 'logout') {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          navigate(APP_URLS.login);
        },
        onError: () => {
          setToastMsg('Erro ao tentar desconectar da conta.');
        },
      });
    } else {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          navigate(APP_URLS.register);
        },
        onError: () => {
          setToastMsg('Erro ao tentar deletar conta.');
        },
      });
    }
  };

  return (
    <>
      {!!toastMsg && (
        <Toast
          isOpen={!!toastMsg}
          onClick={() => setToastMsg(null)}
          message={toastMsg}
          bgColor="#f73838ff"
          ariaLive="assertive"
        />
      )}
      {!!dialogConfig && <Dialog {...dialogConfig} />}
      <nav className={styles.menubar}>
        <button onClick={() => setActiveSidebar('navigation')}>
          <FokusIcon iconKey="menu" />
        </button>

        <nav
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
        </nav>

        <button onClick={() => setActiveSidebar('aside')} data-sidebar="aside">
          <FokusIcon iconKey="user" />
        </button>

        <div
          className={`${styles.aside} ${activeSidebar === 'aside' ? styles.open : ''}`}
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
                  className={user?.themeMode === 'light' ? styles.selected : ''}
                >
                  <FokusIcon iconKey="sun" />
                </span>
                <span
                  className={user?.themeMode === 'dark' ? styles.selected : ''}
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
                <a
                  href="https://www.instagram.com/almeyda.dev/"
                  target="_blank"
                >
                  <span>
                    <FokusIcon iconKey="instagram" aria-hidden="true" />
                    Instagram
                  </span>
                  <FokusIcon iconKey="big-right" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/gabriel-almeyda/"
                  target="_blank"
                >
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

          <section className={styles.aside__btns}>
            <Button
              onClick={handleAccountBtnsClick}
              variant="ghost-inverse"
              data-action="logout"
            >
              Desconectar
            </Button>
            <Button
              onClick={handleAccountBtnsClick}
              customColor="#ee1d1d"
              className={styles.btns__deleteAccount}
              data-action="delete"
            >
              Deletar sua conta
            </Button>
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
