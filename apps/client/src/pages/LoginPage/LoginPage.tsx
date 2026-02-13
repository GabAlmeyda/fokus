import type { JSX } from 'react';
import PageView from '../../components/layouts/PageView/PageView';
import Main from '../../components/layouts/Main/Main';

import styles from './LoginPage.module.css';
import { useForm } from 'react-hook-form';
import {
  API_URL,
  HTTPStatusCode,
  UserLoginSchema,
  type UserLoginDTO,
  type UserResponseDTO,
} from '@fokus/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../config/api.config';
import { useUserStore } from '../../config/zustand.config';
import { useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../helpers/app.helpers';
import FormErrorMessage from '../../components/common/FormErrorMessage/FormErrorMessage';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UserLoginDTO>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserLoginDTO) => {
    try {
      const response = await api.post<UserResponseDTO>(
        `${API_URL}/auth/login`,
        data,
      );
      setUser({
        name: response.data.name,
        email: response.data.email,
        themeMode: response.data.themeMode,
      });

      navigate(APP_URLS.home);
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        const statusCode = err.response
          .status as (typeof HTTPStatusCode)[keyof typeof HTTPStatusCode];

        if (statusCode === HTTPStatusCode.NOT_FOUND) {
          setError('root', { message: 'Email ou senha incorretos.' });

          return;
        }
      }

      setError('root', {
        message: 'Erro ao tentar conectar. Tente novamente.',
      });
    }
  };

  return (
    <PageView bgType="inverse">
      <Main>
        <section className={styles.login}>
          <div className={styles.login__top}>
            <h2>Conecte-se</h2>
          </div>

          <div className={styles.login__formContainer}>
            {errors.root && (
              <span className={styles.login__formError}>
                <FormErrorMessage message={errors.root.message} />
              </span>
            )}
            <form
              action="POST"
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="on"
              className={styles.login__form}
            >
              <div className={styles.form__inputs}>
                <div>
                  <Input
                    {...register('email')}
                    hasError={!!errors.email}
                    placeholder="Email"
                    type="email"
                    autoComplete="username"
                  />
                  {errors.email && (
                    <FormErrorMessage message={errors.email.message} />
                  )}
                </div>

                <div>
                  <Input
                    {...register('password')}
                    hasError={!!errors.password}
                    placeholder="Senha"
                    type="password"
                    autoComplete="password"
                  />
                  {errors.password && (
                    <FormErrorMessage message={errors.password.message} />
                  )}
                </div>
              </div>

              <div className={styles.form__btn}>
                <Button>Conecte-se</Button>
              </div>
            </form>
          </div>

          <div className={styles.login__register}>
            <p>Ainda não possui uma conta?</p>
            <div className={styles.register__btn}>
              <Button
                variant="ghost-inverse"
                onClick={() => navigate(APP_URLS.register)}
              >
                Crie sua conta agora
              </Button>
            </div>
          </div>
        </section>
      </Main>
    </PageView>
  );
}
