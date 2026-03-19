import React from 'react';
import { SkillTag, Button, Avatar, IconButton } from '@/components/ui';
import LikeOutline from '@/assets/icons/like-outline.svg';
import LikeFilled from '@/assets/icons/like-filled.svg';
import { SkillCategorySlug } from '@/utils/types';
import styles from './UserCard.module.scss';

export type UserSkill = {
  name: string;
  category?: SkillCategorySlug;
};

export interface UserCardProps {
  id: string | number;
  name: string;
  avatar?: string;
  city: string;
  birthday: string;
  skillsTeach: UserSkill[];
  skillsLearn: UserSkill[];
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

  const formatAge = (age: number) => {
    if (age % 10 === 1 && age % 100 !== 11) return 'год';
    if (age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 10 || age % 100 >= 20)) return 'года';
    return 'лет';
  };

  const renderSkillTags = (skills: UserSkill[]) => {
    const visibleSkills = skills.slice(0, 2);
    const remainingCount = skills.length - visibleSkills.length;
    return (
      <>
        {visibleSkills.map((skill, index) => (
          <SkillTag
            key={`${skill.name}-${index}`}
            label={skill.name}
            category={skill.category ?? 'other'}
          />
        ))}
        {remainingCount > 0 && <SkillTag label="" count={remainingCount} category="other" />}
      </>
    );
  };

  const handleFavoriteClick = () => onFavoriteToggle(id);
  const handleDetailsClick = () => onDetailsClick(id);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.profileBlock}>
          <Avatar src={avatar} name={name} size="md" />
          <div className={styles.userMeta}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.location}>
              {city}, {age} {formatAge(age)}
            </p>
          </div>
        </div>

        <IconButton
          iconSrc={isFavorite ? LikeFilled : LikeOutline}
          ariaLabel={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          onClick={handleFavoriteClick}
          className={styles.favoriteButton}
        />
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Может научить:</h4>
        <div className={styles.skillsList}>{renderSkillTags(skillsTeach)}</div>
      </div>

      <div className={styles.skillsSection}>
        <h4 className={styles.skillsTitle}>Хочет научиться:</h4>
        <div className={styles.skillsList}>{renderSkillTags(skillsLearn)}</div>
      </div>

      <Button variant="primary" onClick={handleDetailsClick}>
        Подробнее
      </Button>
    </article>
  );
};
