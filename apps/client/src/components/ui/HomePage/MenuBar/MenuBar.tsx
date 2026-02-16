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
import api from '../../../../config/api.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserResponseDTO, UserUpdateDTO } from '@fokus/shared';

export default function MenuBar(): JSX.Element {
  const queryClient = useQueryClient();
  const { data: user } = useQuery<NonNullable<UserResponseDTO>>({
    queryKey: ['user'],
    enabled: false,
  });
  const mutation = useMutation({
    mutationFn: async (updatedUser: UserUpdateDTO) => {
      const response = await api.patch('/users/me', updatedUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {}
  });
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const onNavigationClick = () => setIsNavigationOpen((oldState) => !oldState);
  const onProfileClick = () => setIsProfileOpen((oldState) => !oldState);
  const onToggleThemeClick = () => {
    const theme = user!.themeMode === 'light' ? 'dark' : 'light';
    const updatedUser: UserUpdateDTO = {
      ...user,
      themeMode: theme,
    };

    mutation.mutate(updatedUser);
  };

  return (
    <nav className={styles.menubar}>
      <button onClick={onNavigationClick}>
        <IoMenu />
      </button>

      <nav
        className={clsx(
          styles.navigation,
          isNavigationOpen && styles.navigation_open,
        )}
      >
        <div className={styles.shared__goBack}>
          <Button onClick={onNavigationClick} variant="ghost-inverse" isSmall>
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

      <button onClick={onProfileClick}>
        <MdAccountCircle />
      </button>

      <div
        className={clsx(
          styles.profile,
          isProfileOpen && styles['profile_open'],
        )}
      >
        <div className={styles.shared__goBack}>
          <Button onClick={onProfileClick} variant="ghost-inverse" isSmall>
            Voltar
          </Button>
        </div>

        <div className={styles.profile__user}>
          <MdAccountCircle className={styles.user__img} />
          <div>
            <p className={styles.user__name}>{user!.name}</p>
            <p className={styles.user__email}>{user!.email}</p>
          </div>
        </div>

        <div className={styles.profile__theme}>
          <p>Tema:</p>
          <div className={styles.theme__toggle} onClick={onToggleThemeClick}>
            <span
              className={clsx(
                user!.themeMode === 'light' && styles.theme_selected,
              )}
            >
              <MdLightMode />
            </span>
            <span
              className={clsx(
                user!.themeMode === 'dark' && styles.theme_selected,
              )}
            >
              <MdDarkMode />
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
