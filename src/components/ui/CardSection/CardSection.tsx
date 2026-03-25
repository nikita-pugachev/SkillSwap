import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { UserCard } from '@/components/ui/UserCard/UserCard';
import type { UserCardModel } from '@/utils/types';

import styles from './CardSection.module.scss';

import Icon from '@/assets/icons/chevron-right.svg?react';

export interface UsersSectionProps {
  title?: string;
  buttonText?: string;
  onActionClick?: () => void;
  cards: UserCardModel[];
  isLogin: boolean;
}

export const CardSection = ({
  title,
  buttonText,
  onActionClick,
  cards,
  isLogin,
}: UsersSectionProps) => {
  const navigate = useNavigate();

  const handleDetailsClick = (id: string | number) => {
    navigate(`/skill/${id}`);
  };

  return (
    <section className={styles.cardSection}>
      {(title || buttonText) && (
        <div className={styles.textContainer}>
          {title && <h2 className={styles.title}>{title}</h2>}

          {buttonText && onActionClick && (
            <Button variant="tertiary" className={styles.showAllButton} onClick={onActionClick}>
              <span className={styles.buttonContent}>
                <span>{buttonText}</span>
                <Icon className={styles.icon} />
              </span>
            </Button>
          )}
        </div>
      )}

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
            likes={card.likes}
            isLogin={isLogin}
            onDetailsClick={handleDetailsClick}
          />
        ))}
      </div>
    </section>
  );
};
