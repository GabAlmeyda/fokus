import { useForm } from 'react-hook-form';
import Button from '../../../common/Button/Button';
import styles from './CategoryForm.module.css';
import Input from '../../../common/Input/Input';
import FormErrorMessage from '../../../common/FormErrorMessage/FormErrorMessage';
import { useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const CategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Informe no mínimo 2 caracteres')
    .refine((val) => {
      const v = val.trim();
      return /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]+$/.test(v);
    }, 'Apenas letras, espaços e hífens são permitidos'),
});
type CategoryDTO = z.infer<typeof CategorySchema>;

interface CategoryFormProps {
  onCloseClick: () => void;
  onSubmit: (data: { name: string }) => void;
  isPending?: boolean;
  errors: Partial<Record<'name' | 'root', { message: string }>>;
  oldValues?: { name: string };
}

export default function ProgressLogForm({
  onCloseClick,
  onSubmit,
  isPending = false,
  errors,
  oldValues,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setError,
  } = useForm<CategoryDTO>({
    defaultValues: oldValues ?? { name: '' },
    resolver: zodResolver(CategorySchema),
  });
  const isUpdate = !!oldValues;
  const categoryErrors = { ...formErrors, ...errors };

  useEffect(() => {
    Object.keys(errors).forEach((e) => {
      const err = e as 'name' | 'root';
      setError(err, { message: errors[err]?.message });
    });
  }, [errors]);

  return (
    <>
      <div className={styles.category} onMouseDown={(e) => e.stopPropagation()}>
        <span className={styles.category__goBack}>
          <Button
            variant="ghost-inverse"
            isSmall
            onClick={onCloseClick}
            className={styles.goBack__btn}
          >
            Voltar
          </Button>
        </span>
        <h2>{isUpdate ? 'Atualizar categoria' : 'Nova categoria'}</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className={styles.category__form}
        >
          <div>
            <label htmlFor="category-name">
              {isUpdate ? 'Novo nome da categoria' : 'Nome da nova categoria'}
            </label>
            <Input
              {...register('name')}
              hasError={!!categoryErrors.name}
              placeholder="Nome"
              aria-describedby="name-error"
              id="category-name"
              className={`${styles.form__input} ${!!errors.name ? styles.error : ''}`}
            />
            <FormErrorMessage
              id="name-error"
              isHidden={!categoryErrors.name}
              message={categoryErrors?.name?.message}
            />
          </div>

          <div className={styles.form__btn}>
            <Button type="submit" isDisabled={isPending}>
              {isUpdate
                ? isPending
                  ? 'Atualizando categoria...'
                  : 'Atualizar categoria'
                : isPending
                  ? 'Adicionando categoria...'
                  : 'Adicionar categoria'}
            </Button>
          </div>
        </form>
      </div>
      <div className={styles._category__shadow} onClick={onCloseClick}></div>
    </>
  );
}
