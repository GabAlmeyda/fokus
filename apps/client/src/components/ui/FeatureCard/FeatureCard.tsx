import type { JSX } from 'react';
import styles from './FeatureCard.module.css';
import clsx from 'clsx';

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
    <div className={clsx(styles.card, [{ [styles['card_isReverse']]: isReverse }])}>
      <div className={styles.card__img}>
        <img src={image} alt={title} />
      </div>

      <div className={styles.card__line}></div>

      <div className={styles.card__content}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
