import type { JSX } from 'react';
import heroImage from '../../assets/hero-img.svg';
import PageView from '../../components/layouts/PageView/PageView';
import Main from '../../components/layouts/Main/Main';
import Button from '../../components/common/Button/Button';
import styles from './LandingPage.module.css';
import FeatureCard from '../../components/ui/FeatureCard/FeatureCard';
import notificationImage from '../../assets/notification-img.png';
import organizationImage from '../../assets/organization-img.png';
import routineImage from '../../assets/routine-img.png';

export default function LandingPage(): JSX.Element {
  return (
    <PageView>
      <Main>
        <section className={styles.hero}>
          <h1>Construa seus hábitos e registre suas metas rapidamente</h1>
          <h2>Com o Fokus, seguir uma rotina nunca foi tão fácil.</h2>

          <div className={styles.btns}>
            <Button variant="primary">Crie agora sua conta</Button>
            <p>ou</p>
            <Button variant="ghost-inverse">Conecte-se agora</Button>
          </div>

          <div className={styles.heroImg}>
            <img src={heroImage} alt="" />
          </div>
        </section>

        <section className={styles.features}>
          <FeatureCard
            image={organizationImage}
            title="Minimalista e eficiente"
            description="Programe rapidamente seus hábitos com uma interface simples e eficáz."
          />
          <FeatureCard
            image={notificationImage}
            title="Seja lembrado das suas tarefas"
            description="Sempre saiba sua próxima tarefa com nosso sistema de notificação."
            isReverse
          />
          <FeatureCard
            image={routineImage}
            title="Faça sua rotina rapidamente"
            description="Usando o Fokus fica fácil criar tarefas recorrentes diárias, semanais ou mensais."
          />
        </section>

        <section className={styles.cta}>
          <h2>Construa seu próximo hábito.</h2>
          <p>
            Crie uma nova versão mais organizada, saudável e melhor de si mesmo.
          </p>

          <div className={styles.cta__btn}>
            <Button>Crie agora sua conta</Button>
          </div>
        </section>
      </Main>
    </PageView>
  );
}
