import { type JSX } from 'react';
import { HTTPStatusCode, UserRegisterSchema, type UserResponseDTO } from '@fokus/shared';
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
import InputErrorMessage from '../../components/common/InputErrorMessage/InputErrorMessage';
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

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post<UserResponseDTO>(`/users/auth/register`, data);
      setUser(response.data);

      navigate(APP_URLS.home);
    } catch (err: any) {
      if (err.response) {
        const statusCode = err.response
          .status as (typeof HTTPStatusCode)[keyof typeof HTTPStatusCode];

        if (statusCode === HTTPStatusCode.CONFLICT) {
          setError('email', {
            message: 'Email já cadastrado.',
          });
        }
      }
    }
  };

  return (
    <PageView>
      <Main>
        <section className={styles.register}>
          <h2>Cadastre-se</h2>
          <form
            action=""
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
                  <InputErrorMessage message={errors.name.message} />
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
                  <InputErrorMessage message={errors.email.message} />
                )}
              </div>

              <div>
                <Input
                  {...register('password')}
                  hasError={!!errors.password}
                  placeholder="Senha"
                  type="password"
                  autoComplete="off"
                />
                {errors.password && (
                  <InputErrorMessage message={errors.password.message} />
                )}
              </div>

              <div>
                <Input
                  {...register('confirmPassword')}
                  hasError={!!errors.confirmPassword}
                  placeholder="Confirme sua senha"
                  type="password"
                  autoComplete="off"
                />
                {errors.confirmPassword && (
                  <InputErrorMessage message={errors.confirmPassword.message} />
                )}
              </div>
            </div>

            <div className={styles.form__btn}>
              <Button>Crie sua conta</Button>
            </div>
          </form>

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
