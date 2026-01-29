import type { JSX } from 'react';
import styles from './Testimonial.module.css';

interface TestimonialProps {
  image: string;
  name: string;
  role: string;
  review: string;
}

export default function RevieTestimonialwCard({
  image,
  name,
  role,
  review,
}: TestimonialProps): JSX.Element {
  return (
    <figure className={styles.card}>
      <blockquote className={styles.card__comment}>"{review}"</blockquote>

      <figcaption className={styles.card__user}>
        <img src={image} alt={`${name}`} className={styles.user__img} />

        <div className={styles.user__data}>
          <span className={styles.data__name}>{name}</span>
          <span className={styles.data__role}>{role}</span>
        </div>
      </figcaption>
    </figure>
  );
}
