import type { JSX } from 'react';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  isReverse?: boolean;
}

export default function FeatureCard({
  image,
  title,
  description,
  isReverse,
}: FeatureCardProps): JSX.Element {
  return (
    <div className={`${styles.card} ${isReverse ? styles.reverse : ''}`}>
      <div className={styles.card__img}>
        <img src={image} alt={title} />
      </div>

      <div className={styles.card__line}></div>

      <div className={styles.card__content}>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
