import { useEffect, type JSX } from 'react';
import {
  HTTPStatusCode,
  UserRegisterSchema,
  type UserRegisterDTO,
} from '@fokus/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../components/common/Input/Input';
import styles from './RegisterPage.module.css';
import Button from '../../components/common/Button/Button';
import PageView from '../../components/layouts/PageView/PageView';
import { useNavigate } from 'react-router-dom';
import { APP_URLS } from '../../helpers/app.helpers';
import FormErrorMessage from '../../components/common/FormErrorMessage/FormErrorMessage';
import { useUserMutations } from '../../helpers/hooks/use-user.hook';
import Footer from '../../components/layouts/Footer/Footer';

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
  const registerMutation = useUserMutations().registerMutation;

  useEffect(() => {
    document.title = 'Fokus - Cadastre-se';
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    const user: UserRegisterDTO = {
      name: data.name,
      email: data.email,
      password: data.password,
      themeMode: data.themeMode || 'light',
    };
    await registerMutation.mutateAsync(user, {
      onError: (error) => {
        if (error.statusCode === HTTPStatusCode.CONFLICT) {
          setError('root', { message: 'Email já cadastrado.' });
          return;
        }

        setError('root', {
          message: 'Erro ao tentar cadastrar. Tente novamente.',
        });
      },
      onSuccess: () => {
        navigate(APP_URLS.home);
      },
    });
    navigate(APP_URLS.home);
  };

  return (
    <PageView cssBgType="inverse">
      <main>
        <section className={styles.register}>
          <div className={styles.register__top}>
            <h2>Cadastre-se</h2>
          </div>

          <div className={styles.register__formContainer}>
            {errors.root && (
              <span className={styles.register__formError}>
                <FormErrorMessage
                  id="form-error"
                  isHidden={!!errors.root}
                  message={errors.root.message}
                />
              </span>
            )}
            <form
              action="POST"
              onSubmit={handleSubmit(onSubmit)}
              className={styles.register__form}
              autoComplete="on"
              aria-describedby="form-error"
            >
              <div className={styles.form__inputs}>
                <div>
                  <Input
                    {...register('name')}
                    hasError={!!errors.name}
                    placeholder="Nome"
                    type="text"
                    autoComplete="name"
                    aria-describedby="name-error"
                    aria-label="Insira seu nome"
                  />
                  {errors.name && (
                    <FormErrorMessage
                      id="name-error"
                      isHidden={!!errors.name}
                      message={errors.name.message}
                    />
                  )}
                </div>

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
                      isHidden={!!errors.email}
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
                    autoComplete="new-password"
                    aria-describedby="password-error"
                    aria-label="Insira uma senha"
                  />
                  {errors.password && (
                    <FormErrorMessage
                      id="password-error"
                      isHidden={!!errors.password}
                      message={errors.password.message}
                    />
                  )}
                </div>

                <div>
                  <Input
                    {...register('confirmPassword')}
                    hasError={!!errors.confirmPassword}
                    placeholder="Confirme sua senha"
                    type="password"
                    autoComplete="new-password"
                    aria-describedby="confirm-password-error"
                    aria-label="Digite novamente a senha"
                  />
                  {errors.confirmPassword && (
                    <FormErrorMessage
                      id="confirm-password-error"
                      isHidden={!!errors.confirmPassword}
                      message={errors.confirmPassword.message}
                    />
                  )}
                </div>
              </div>

              <div className={styles.form__btn}>
                <Button isDisabled={registerMutation.isPending}>
                  {registerMutation.isPending
                    ? 'Criando conta...'
                    : 'Crie sua conta agora'}
                </Button>
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
      </main>
      <Footer />
    </PageView>
  );
}
