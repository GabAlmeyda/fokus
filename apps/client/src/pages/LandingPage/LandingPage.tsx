import type { JSX } from 'react';
import heroImage from '../../assets/hero-img.svg';
import PageView from '../../components/layouts/PageView/PageView';
import Main from '../../components/layouts/Main/Main';
import Button from '../../components/ui/Button/Button';
import styles from './LandingPage.module.css';

export default function LandingPage(): JSX.Element {
  return (
    <PageView>
      <Main>
        <section className={styles.hero}>
          <h1>Construa seus hábitos e registre suas metas rapidamente</h1>
          <h2>Com o Fokus, seguir uma rotina nunca foi tão fácil.</h2>

          <div className={styles.btns}>
            <Button variant='primary'>Crie agora sua conta</Button>
            <p>ou</p>
            <Button variant='ghost-inverse'>Conecte-se agora</Button>
          </div>

          <div className={styles.heroImg}>
            <img src={heroImage} alt="" />
          </div>
        </section>
      </Main>
    </PageView>
  );
}
