import { useEffect, type JSX } from 'react';
import {
  HTTPStatusCode,
  UserRegisterSchema,
  type UserResponseDTO,
} from '@fokus/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Main from '../../components/layouts/Main/Main';
import Input from '../../components/common/Input/Input';
import styles from './RegisterPage.module.css';
import Button from '../../components/common/Button/Button';
import PageView from '../../components/layouts/PageView/PageView';
import { useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../helpers/app.helpers';
import api from '../../config/api.config';
import FormErrorMessage from '../../components/common/FormErrorMessage/FormErrorMessage';
import { useUserStore } from '../../config/zustand.config';

const RegisterFormSchema = UserRegisterSchema.extend({
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Senhas diferentes digitadas.',
      path: ['confirmPassword'],
    });
  }
});
type RegisterFormData = z.input<typeof RegisterFormSchema>;

export default function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      themeMode: 'light',
    },
  });

  // Changes the page title
  useEffect(() => {
    document.title = 'Fokus - Cadastre-se';
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post<UserResponseDTO>(
        `/users/auth/register`,
        data,
      );
      setUser({
        name: response.data.name,
        email: response.data.email,
        themeMode: response.data.themeMode,
      });

      navigate(APP_URLS.home);
    } catch (err: any) {
      if (err.response) {
        const statusCode = err.response
          .status as (typeof HTTPStatusCode)[keyof typeof HTTPStatusCode];

        if (statusCode === HTTPStatusCode.CONFLICT) {
          setError('root', {
            message: 'Email já cadastrado.',
          });

          return;
        }
      }

      setError('root', { message: 'Erro ao cadastrar. Tente novamente.' });
    }
  };

  return (
    <PageView bgType="inverse">
      <Main>
        <section className={styles.register}>
          <div className={styles.register__top}>
            <h2>Cadastre-se</h2>
          </div>

          <div className={styles.register__formContainer}>
            {errors.root && (
              <span className={styles.register__formError}>
                <FormErrorMessage message={errors.root.message} />
              </span>
            )}
            <form
              action="POST"
              onSubmit={handleSubmit(onSubmit)}
              className={styles.register__form}
              autoComplete="on"
            >
              <div className={styles.form__inputs}>
                <div>
                  <Input
                    {...register('name')}
                    hasError={!!errors.name}
                    placeholder="Nome"
                    type="text"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <FormErrorMessage message={errors.name.message} />
                  )}
                </div>

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
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <FormErrorMessage message={errors.password.message} />
                  )}
                </div>

                <div>
                  <Input
                    {...register('confirmPassword')}
                    hasError={!!errors.confirmPassword}
                    placeholder="Confirme sua senha"
                    type="password"
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <FormErrorMessage
                      message={errors.confirmPassword.message}
                    />
                  )}
                </div>
              </div>

              <div className={styles.form__btn}>
                <Button>Crie sua conta</Button>
              </div>
            </form>
          </div>

          <div className={styles.register__login}>
            <p>Já possui uma conta?</p>
            <div className={styles.login__btn}>
              <Button
                variant="ghost-inverse"
                onClick={() => navigate(APP_URLS.login)}
              >
                Conecte-se agora
              </Button>
            </div>
          </div>
        </section>
      </Main>
    </PageView>
  );
}
