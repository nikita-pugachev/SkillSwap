import { useState, useMemo } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
import type { SkillCategoryData } from '@/components/FilterSidebar';
import { UserCard } from '@/components/user-card';
import { useLoadCatalogData } from '@/services/hooks/useLoadCatalogData';
import { useAppSelector } from '@/services/hooks';
import type { Filters } from '@/utils/types';

export const CatalogPage = () => {
  const [filters, setFilters] = useState<Filters>({
    mode: 'all',
    skills: [],
    gender: null,
    city: [],
  });

  const { users, skills, cities, loading, error } = useAppSelector((state) => state.catalog);
  useLoadCatalogData();

  const getSkillNameById = (id: number): string => {
    for (const category of skills) {
      const sub = category.subcategories.find((sub) => sub.id === id);
      if (sub) return sub.title;
    }
    return `Навык ${id}`;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filters.gender) {
        const genderMap = {
          Мужской: 'male',
          Женский: 'female',
        } as const;
        if (user.gender !== genderMap[filters.gender]) return false;
      }

      if (filters.city.length > 0) {
        const userCityName = cities.find((city) => city.id === user.cityId)?.name;
        if (!userCityName || !filters.city.includes(userCityName)) return false;
      }

      if (filters.mode === 'wantToLearn') {
        return (
          filters.skills.length === 0 ||
          user.skillsLearn.some((skillId) => filters.skills.includes(skillId))
        );
      }

      if (filters.mode === 'canTeach') {
        return (
          filters.skills.length === 0 ||
          user.skillsTeach.some((skill) => filters.skills.includes(skill.subcategoryId))
        );
      }

      return true;
    });
  }, [users, filters, cities]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <FilterSidebar
        filters={filters}
        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        cities={cities.map((city) => city.name)}
        categories={skills as SkillCategoryData[]}
      />
      <div>
        {filteredUsers.map((user) => {
          const cityName =
            cities.find((city) => city.id === user.cityId)?.name ?? 'Неизвестный город';

          const teachSkills = user.skillsTeach.map((skill) => ({
            name: skill.customTitle,
            category: 'other' as const,
          }));

          const learnSkills = user.skillsLearn.map((id) => ({
            name: getSkillNameById(id),
            category: 'other' as const,
          }));

          return (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              avatar={user.userAvatar}
              city={cityName}
              birthday={user.birthday}
              skillsTeach={teachSkills}
              skillsLearn={learnSkills}
              onDetailsClick={() => {}} // TODO: переход на страницу навыка
            />
          );
        })}
      </div>
    </div>
  );
};

export default CatalogPage;
