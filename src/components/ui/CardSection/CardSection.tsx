import styles from './CardSection.module.scss';
import Icon from '@/assets/icons/chevron-right.svg?react';
import { Link } from 'react-router-dom';
import { UserCard } from '@/components/user-card';
import type { User } from '@/utils/types';

export interface UsersSectionProps {
  title: string;
  buttonText: string;
  showAllLink?: string;
  cards: User[];
}

export const CardSection = ({ title, buttonText, showAllLink, cards }: UsersSectionProps) => {
  const handleDetailsClick = (id: string | number) => {
    console.log(id);
  };

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
      <div className={styles.cardContainer}>
        {cards.map((card) => (
          <UserCard
            key={card.id}
            id={card.id}
            name={card.name}
            avatar={card.avatar}
            city={card.city}
            birthday={card.birthday}
            skillsTeach={card.skillsTeach}
            skillsLearn={card.skillsLearn}
            onDetailsClick={() => handleDetailsClick}
          />
        ))}
      </div>
    </section>
  );
};
