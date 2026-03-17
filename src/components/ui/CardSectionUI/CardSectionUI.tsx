import styles from './CardSectionUI.module.scss';
import Icon from '../../../assets/icons/chevron-right.svg?react';
import { Button } from '../ButtonUI';

// import {UserCard} from '../UserCard'

export interface UsersSectionProps {
  title: string;
  buttonText: string;
  //   cards: []; //User[]
  onButtonClick: () => void;
}

export const CardSectionUI = ({
  title,
  buttonText,
  // cards,
  onButtonClick,
}: UsersSectionProps) => {
  return (
    <section className={styles.cardSection}>
      <div className={styles.textContainer}>
        {/* Вот тут вот очень странно, по стилям у нас стили для h1 и в макете 
                и в переменных, но как бы тогда семантически неверно, так как несколько 
                h1 на странице. скажите на что заменить)) */}
        <h1 className={styles.title}>{title}</h1>
        <Button onClick={onButtonClick} variant="tertiary" className={styles.button}>
          <span className={styles.buttonContent}>
            <span>{buttonText}</span>
            <Icon className={styles.icon} />
          </span>
        </Button>
      </div>
      <div className={styles.cardContainer}>
        {/* {cards.map((user) =>
          рендер карточек, поправлю для правильного отображения, но условно вот так
              <UserCard
              key={user.id}
              user={user}
              />
        )} */}
      </div>
    </section>
  );
};
