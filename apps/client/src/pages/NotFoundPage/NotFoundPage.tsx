import styles from './NotFoundPage.module.css';
import PageView from '../../components/layouts/PageView/PageView';
import { useEffect } from 'react';
import notFoundImg from '../../assets/not-found-img.svg';
import Button from '../../components/common/Button/Button';
import { APP_URLS } from '../../helpers/app.helpers';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Fokus - Página não encontrada';
  }, []);
  return (
    <PageView customBgColor="#030c07">
      <main>
        <section className={styles.notFound}>
          <h1>Erro 404</h1>
          <h2>Página não encontrada</h2>
          <div className={styles.notFound__img}>
            <img src={notFoundImg} alt="Dados não encontrados" />
          </div>

          <p>
            Ah, não! Parece que não existe nada por aqui. Que tal voltar para a
            tela inicial?
          </p>

          <div className={styles.notFound__btn}>
            <Button isLink to={APP_URLS.home}>
              Voltar para o início
            </Button>
          </div>
        </section>
      </main>
    </PageView>
  );
}
