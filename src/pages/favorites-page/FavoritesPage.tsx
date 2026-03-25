import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserCard } from '@/components/user-card';
import { selectFavoriteIds } from '@/services/selectors';
import type { SkillCategorySlug, UserFromDb, City, SkillCategory } from '@/utils/types';
import styles from './FavoritesPage.module.scss';

export const FavoritesPage: React.FC = () => {
  const favoriteIds = useSelector(selectFavoriteIds);
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [users, setUsers] = useState<UserFromDb[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/db/cities.json');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки городов');
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/db/skills.json');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки навыков');
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/db/users.json');

        if (!response.ok) {
          throw new Error('Ошибка загрузки пользователей');
        }

        const data = await response.json();
        const allUsers: UserFromDb[] = data.users;

        const favoriteUsers = allUsers.filter((user) => favoriteIds.includes(Number(user.id)));

        setUsers(favoriteUsers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки пользователей');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [favoriteIds]);

  const getCityName = (cityId: number): string => {
    const city = cities.find((c) => c.id === cityId);
    return city ? city.name : 'Город не указан';
  };

  const getSkillName = (skillId: number): string => {
    for (const category of skills) {
      const subcategory = category.subcategories.find((sub) => sub.id === skillId);
      if (subcategory) {
        return subcategory.title;
      }
    }
    return `Навык ${skillId}`;
  };

  const getSkillCategory = (skillId: number): SkillCategorySlug => {
    for (const category of skills) {
      const subcategory = category.subcategories.find((sub) => sub.id === skillId);
      if (subcategory) {
        return category.slug;
      }
    }
    return 'other';
  };

  const getSkillCategoryBySubcategoryId = (subcategoryId: number): SkillCategorySlug => {
    const category = skills.find((cat) =>
      cat.subcategories.some((sub) => sub.id === subcategoryId)
    );
    return category ? category.slug : 'other';
  };

  const handleDetailsClick = (userId: string | number) => {
    navigate(`/profile/${userId}`);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Загрузка избранных пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {users.length === 0 ? (
        <div className={styles.emptyState}>У вас пока нет избранных пользователей</div>
      ) : (
        <div className={styles.grid}>
          {users.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              avatar={user.userAvatar}
              city={getCityName(user.cityId)}
              birthday={user.birthday}
              skillsTeach={user.skillsTeach.map((skill) => ({
                name: skill.customTitle,
                category: getSkillCategoryBySubcategoryId(skill.subcategoryId),
              }))}
              skillsLearn={user.skillsLearn.map((skillId) => ({
                name: getSkillName(skillId),
                category: getSkillCategory(skillId),
              }))}
              onDetailsClick={handleDetailsClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default FavoritesPage;
