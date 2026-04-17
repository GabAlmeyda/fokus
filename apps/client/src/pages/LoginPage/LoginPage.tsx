import { useEffect, type JSX } from 'react';
import PageView from '../../components/layouts/PageView/PageView';
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
import { useUserMutations } from '../../helpers/hooks/use-user.hook';
import Footer from '../../components/layouts/Footer/Footer';

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const loginMutation = useUserMutations().loginMutation;
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

  useEffect(() => {
    document.title = 'Fokus - Conecte-se';
  }, []);

  const handleFormSubmit = async (data: UserLoginDTO) => {
    await loginMutation.mutateAsync(data, {
      onError: (error) => {
        if (error.statusCode === HTTPStatusCode.NOT_FOUND) {
          setError('root', { message: 'Email ou senha incorretos.' });
        } else {
          setError('root', {
            message: 'Erro ao tentar conectar. Tente novamente.',
          });
        }
      },
      onSuccess: () => {
        navigate(APP_URLS.home);
      },
    });
  };

  return (
    <PageView cssBgType="primary">
      <main>
        <section className={styles.login}>
          <div className={styles.login__top}>
            <h2>Conecte-se</h2>
          </div>

          <div className={styles.login__formContainer}>
            {errors.root && (
              <span className={styles.login__formError}>
                <FormErrorMessage
                  id="form-error"
                  isHidden={!errors.root}
                  message={errors.root.message}
                />
              </span>
            )}
            <form
              action="POST"
              onSubmit={handleSubmit(handleFormSubmit)}
              autoComplete="on"
              className={styles.login__form}
              aria-describedby="form-error"
            >
              <div className={styles.form__inputs}>
                <div>
                  <Input
                    {...register('email')}
                    hasError={!!errors.email}
                    placeholder="Email"
                    type="email"
                    autoComplete="username"
                    aria-describedby="email-error"
                    aria-label="Insira seu email"
                  />
                  {errors.email && (
                    <FormErrorMessage
                      id="email-error"
                      isHidden={!errors.email}
                      message={errors.email.message}
                    />
                  )}
                </div>

                <div>
                  <Input
                    {...register('password')}
                    hasError={!!errors.password}
                    placeholder="Senha"
                    type="password"
                    autoComplete="password"
                    aria-describedby="password-error"
                    aria-label="Insira sua senha"
                  />
                  {errors.password && (
                    <FormErrorMessage
                      id="password-error"
                      isHidden={!errors.password}
                      message={errors.password.message}
                    />
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
              <Button variant="ghost-inverse" isLink to={APP_URLS.register}>
                Crie sua conta agora
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer className={styles.footer} />
    </PageView>
  );
}
