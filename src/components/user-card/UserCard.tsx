import React from 'react';
import { SkillTag } from '@/components/ui/SkillTag';
import { Button } from '@/components/ui/ButtonUI';
import styles from './UserCard.module.scss';

export interface UserCardProps {
  id: string | number;
  name: string;
  avatar?: string;
  city: string;
  birthday: string; // формат "YYYY-MM-DD"
  skillsTeach: string[]; // названия навыков
  skillsLearn: string[]; // названия навыков
  isFavorite: boolean;
  onFavoriteToggle: (id: string | number) => void;
  onDetailsClick: (id: string | number) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  avatar,
  city,
  birthday,
  skillsTeach,
  skillsLearn,
  isFavorite,
  onFavoriteToggle,
  onDetailsClick,
}) => {
  // Вычисляем возраст из даты рождения
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthday);

  // Отображаем не больше двух тегов + счётчик остальных
  const renderSkillTags = (skills: string[], variant: 'teach' | 'learn') => {
    const visibleSkills = skills.slice(0, 2);
    const remainingCount = skills.length - visibleSkills.length;
    return (
      <>
        {visibleSkills.map((skill, index) => (
          <SkillTag
            key={`${skill}-${index}`}
            label={skill}
            category={variant === 'teach' ? 'education' : 'other'} // подбераем нужную категорию
          />
        ))}
        {remainingCount > 0 && (
          <SkillTag
            label=""
            count={remainingCount}
            category={variant === 'teach' ? 'education' : 'other'}
          />
        )}
      </>
    );
  };

  const handleFavoriteClick = () => onFavoriteToggle(id);
  const handleDetailsClick = () => onDetailsClick(id);

  return (
    <article className={styles.card}>
      {/* Иконка сердечко*/}
      <button
        className={styles.favoriteButton}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      {/* Аватар */}
      <div className={styles.avatarWrapper}>
        {avatar ? (
          <img src={avatar} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{name.charAt(0).toUpperCase()}</div>
        )}
      </div>

      {/* Имя */}
      <h3 className={styles.name}>{name}</h3>

      {/* Город и возраст */}
      <p className={styles.location}>
        {city}, {age}{' '}
        {age % 10 === 1 && age % 100 !== 11
          ? 'год'
          : age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 10 || age % 100 >= 20)
            ? 'года'
            : 'лет'}
      </p>

      {/* Блок «Может научить» */}
      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Может научить:</h4>
        <div className={styles.skillsList}>{renderSkillTags(skillsTeach, 'teach')}</div>
      </div>

      {/* Блок «Хочет научиться» */}
      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Хочет научиться:</h4>
        <div className={styles.skillsList}>{renderSkillTags(skillsLearn, 'learn')}</div>
      </div>

      {/* Кнопка «Подробнее» */}
      <Button variant="primary" onClick={handleDetailsClick} className={styles.detailsButton}>
        Подробнее
      </Button>
    </article>
  );
};
