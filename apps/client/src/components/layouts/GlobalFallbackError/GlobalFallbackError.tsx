import styles from './GlobalFallbackError.module.css';
import PageView from '../PageView/PageView';
import { APP_URLS } from '../../../helpers/app.helpers';
import Button from '../../common/Button/Button';

export default function GlobalErrorFallback() {
  return (
    <PageView>
      <main className={styles.fallback} role="alert">
        <h1>Oh, oh! Parece que um erro ocorreu!</h1>
        <p>Infelizmente, não foi possível carregar suas informações.</p>

        <p>
          Que tal tentar recarregar a página ou{' '}
          <span>voltar para a página inicial?</span>
        </p>
        <div className={styles.fallback__btns}>
          <Button
            onClick={() => window.location.reload()}
            variant="ghost-inverse"
          >
            Tentar novamente
          </Button>
          <a href={APP_URLS.home} target="_self" draggable="false">
            Voltar para o início
          </a>
        </div>
      </main>
    </PageView>
  );
}
