import type { UserUpdateDTO } from '@fokus/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { APP_URLS } from '../../../../helpers/app.helpers';
import {
  useUserQueries,
  useUserMutations,
} from '../../../../helpers/hooks/use-user.hook';
import Button from '../../../common/Button/Button';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';
import FokusIcon from '../../../common/Icon/Icon';
import Input from '../../../common/Input/Input';
import styles from './Aside.module.css';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Dialog from '../../../common/Dialog/Dialog';
import Toast from '../../../common/Toast/Toast';
import { useNavigate } from 'react-router-dom';

const LocalUserUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome muito curto')
    .regex(/^[A-Za-zÀ-ÿ\s\-]+$/, 'Use apenas letras'),
  email: z.email('Email inválido'),
});
type LocalUserUpdateDTO = z.infer<typeof LocalUserUpdateSchema>;

interface AsideProps {
  onCloseClick: () => void;
}

export default function Aside({ onCloseClick }: AsideProps) {
  const { data: user } = useUserQueries().meQuery;
  const navigate = useNavigate();
  const [dialogConfig, setDialogConfig] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LocalUserUpdateDTO>({
    defaultValues: user,
    resolver: zodResolver(LocalUserUpdateSchema),
  });
  const updateMutation = useUserMutations().updateMutation;
  const logoutMutation = useUserMutations().logoutMutation;
  const deleteMutation = useUserMutations().deleteMutation;
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

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
        onError: () =>
          setToastMsg(
            'Não foi possível atualizar os dados da conta. Que tal tentar novamente?',
          ),
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
          setToastMsg(
            'Não foi possível encerrar sua sessão. Que tal tentar novamente?',
          );
        },
      });
    } else {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          navigate(APP_URLS.register);
        },
        onError: () => {
          setToastMsg(
            'Não foi possível deletar sua conta. Que tal tentar novamente?',
          );
        },
      });
    }
  };

  const handleUserUpdateSubmit = (data: UserUpdateDTO) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        setIsUpdateOpen(false);
      },
      onError: () =>
        setToastMsg(
          'Não foi possível atualizar os dados da conta. Que tal tentar novamente?',
        ),
    });
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
      <aside className={styles.aside}>
        <div className={styles.l_menubar__goBack}>
          <Button
            onClick={onCloseClick}
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
          <Button onClick={() => setIsUpdateOpen(true)}>Atualizar dados</Button>

          {isUpdateOpen && (
            <>
              <div className={styles.aside__update}>
                <h2>Atualizar seus dados</h2>
                <form onSubmit={handleSubmit(handleUserUpdateSubmit)}>
                  <div>
                    <label htmlFor="user-name">Insira seu novo nome:</label>
                    <Input
                      {...register('name')}
                      placeholder="Nome"
                      aria-describedby="user-name-error"
                      hasError={!!errors.name}
                      className={styles.update__input}
                    />
                    <FormErrorMessage
                      isHidden={!errors.name}
                      id="user-name-error"
                      message={errors.name?.message}
                    />
                  </div>
                  <div>
                    <label htmlFor="user-email">Insira seu novo email:</label>
                    <Input
                      {...register('email')}
                      placeholder="Email"
                      type="email"
                      aria-describedby="user-email-error"
                      hasError={!!errors.email}
                      className={styles.update__input}
                    />
                    <FormErrorMessage
                      isHidden={!errors.email}
                      id="user-email-error"
                      message={errors.email?.message}
                    />
                  </div>

                  <div className={styles.aside__submit}>
                    <Button
                      onClick={() => setIsUpdateOpen(false)}
                      type="button"
                      isDisabled={updateMutation.isPending}
                      variant="ghost-inverse"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" isDisabled={updateMutation.isPending}>
                      {updateMutation.isPending
                        ? 'Atualizando...'
                        : 'Atualizar'}
                    </Button>
                  </div>
                </form>
              </div>
              <div className={styles._update__backdrop}></div>
            </>
          )}
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
      </aside>
    </>
  );
}
