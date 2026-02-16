import { useEffect, type JSX } from 'react';
import PageView from '../../components/layouts/PageView/PageView';
import Main from '../../components/layouts/Main/Main';
import styles from './LoginPage.module.css';
import { useForm } from 'react-hook-form';
import {
  HTTPStatusCode,
  UserLoginSchema,
  type UserLoginDTO,
} from '@fokus/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../helpers/app.helpers';
import FormErrorMessage from '../../components/common/FormErrorMessage/FormErrorMessage';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { useUserMutations } from '../../helpers/hooks/user-user.hook';

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
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
  const loginMutation = useUserMutations().loginMutation;

  // Changes the page title
  useEffect(() => {
    document.title = 'Fokus - Conecte-se';
  }, []);

  const onSubmit = (data: UserLoginDTO) => {
    loginMutation.mutate(data, {
      onError: (error) => {
        if (error.statusCode === HTTPStatusCode.NOT_FOUND) {
          setError('root', { message: 'Email ou senha incorretos.' });
        } else {
          setError('root', {
            message: 'Erro ao tentar conectar. Tente novamente.',
          });
        }
      },
    });
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
                <Button isDisabled={loginMutation.isPending}>
                  {loginMutation.isPending
                    ? 'Conectando sua conta...'
                    : 'Conecte-se'}
                </Button>
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
