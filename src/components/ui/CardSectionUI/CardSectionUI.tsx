import styles from './CardSectionUI.module.scss';
import Icon from '../../../assets/icons/chevron-right.svg?react';
import { Link } from 'react-router-dom';

// TODO: добавить import UserCard

// TODO: добавить поле cards: User[]
export interface UsersSectionProps {
  title: string;
  buttonText: string;
  showAllLink?: string;
}

export const CardSectionUI = ({ title, buttonText, showAllLink }: UsersSectionProps) => {
  return (
    <section className={styles.cardSection}>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{title}</h2>
        {showAllLink ? (
          <Link to={showAllLink} className={styles.showAll}>
            <span className={styles.buttonContent}>
              <span>{buttonText}</span>
              <Icon className={styles.icon} />
            </span>
          </Link>
        ) : (
          <span className={styles.showAll}>
            <span className={styles.buttonContent}>
              <span>{buttonText}</span>
              <Icon className={styles.icon} />
            </span>
          </span>
        )}
      </div>
      <div className={styles.cardContainer}>{/* TODO: добавить рендер UserCard */}</div>
    </section>
  );
};
