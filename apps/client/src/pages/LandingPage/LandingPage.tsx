import { useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationImage from '../../assets/notification-img.png';
import organizationImage from '../../assets/organization-img.png';
import routineImage from '../../assets/routine-img.png';
import ctaImage from '../../assets/cta.svg';
import Main from '../../components/layouts/Main/Main';
import Button from '../../components/common/Button/Button';
import styles from './LandingPage.module.css';
import FeatureCard from '../../components/ui/LandingPage/FeatureCard/FeatureCard';
import Navbar from '../../components/ui/LandingPage//Navbar/Navbar';
import Testimonial from '../../components/ui/LandingPage/Testimonial/Testimonial';
import { APP_URLS } from '../../helpers/app.helpers';
import PageView from '../../components/layouts/PageView/PageView';

export default function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  // Changes the page title
  useEffect(() => {
    document.title = 'Fokus - Landing Page';
  }, []);

  return (
    <PageView>
      <Navbar />
      <Main>
        <section className={styles.hero}>
          <div className={styles.hero__main}>
            <h1>Construa seus hábitos e registre suas metas rapidamente</h1>
            <h2>
              Transforme sua rotina em resultados e acompanhe sua evolução, um
              dia de cada vez. Mudar de vida nunca foi tão fácil.
            </h2>

            <div className={styles.hero__btns}>
              <Button
                variant="primary"
                onClick={() => navigate(APP_URLS.register)}
              >
                Crie agora sua conta
              </Button>
              <Button
                variant="ghost-inverse"
                onClick={() => navigate(APP_URLS.login)}
              >
                Conecte-se agora
              </Button>
            </div>

            <div className={styles.hero__imgs}>
              <div className={styles.imgs__item}></div>
              <div className={styles.imgs__item}></div>
              <div className={styles.imgs__item}></div>
            </div>
          </div>

          <div className={styles.hero__testimonials}>
            <div className={styles.testimonials__msg}>
              <p>+500 pessoas focadas todos os dias</p>
            </div>
            <div className={styles.testimonials__items}>
              <Testimonial
                image="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                name="Rafaela Santana"
                role="Estudante"
                review="Finalmente consegui tomar coragem para praticar meus hobbies. O Fokus transformou minha preguiça em motivação."
              />

              <Testimonial
                image="https://i.pravatar.cc/150?u=a042581f4e29128704d"
                name="Guilherme Ferreira"
                role="Programador"
                review="Minhas tarefas conseguiram ficar muito mais organizadas depois que comecei a usar o Fokus."
              />

              <Testimonial
                image="https://i.pravatar.cc/150?u=a042180f4e09026704d"
                name="Melissa Vitória"
                role="Designer"
                review="O Fokus é a ferramenta que faltava para equilibrar minha rotina criativa. Consigo tirar as ideias do papel sem me perder no caos das tarefas."
              />
            </div>
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
            description="Usando o Fokus fica fácil criar tarefas recorrentes semanais."
          />
        </section>

        <section className={styles.cta}>
          <div className={styles.cta__content}>
            <div className={styles.cta__text}>
              <h2>Construa o próximo hábito do seu futuro.</h2>
              <p>
                Construa hoje o seu novo eu: equilíbrio e organização em um só
                lugar.
              </p>
            </div>

            <div className={styles.cta__btn}>
              <Button onClick={() => navigate(APP_URLS.register)}>
                Crie agora sua conta
              </Button>
            </div>
          </div>

          <img src={ctaImage} alt="" className={styles.cta__img} />
        </section>
      </Main>
    </PageView>
  );
}
