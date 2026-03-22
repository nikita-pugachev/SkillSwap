import { useState, useEffect, useMemo } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
import { getSkills } from '@/utils/api';
import type { Skill, City, Filters, UserFromDb } from '@/utils/types';

export const CatalogPage = () => {
  const [filters, setFilters] = useState<Filters>({
    mode: 'all',
    skills: [],
    gender: null,
    city: [],
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [users, setUsers] = useState<UserFromDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSkills()
      .then((data) => {
        setSkills(data);
      })
      .catch((err: Error) => {
        console.error('Ошибка загрузки категорий:', err);
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    fetch('/db/cities.json')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки городов');
        return res.json();
      })
      .then((data: City[]) => {
        setCities(data);
      })
      .catch((err: Error) => {
        console.error('Ошибка загрузки городов:', err);
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    fetch('/db/users.json')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки пользователей');
        return res.json();
      })
      .then((data: { users: UserFromDb[] }) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Ошибка загрузки пользователей:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filters.gender) {
        const genderMap = {
          Мужской: 'male',
          Женский: 'female',
        } as const;

        if (user.gender !== genderMap[filters.gender]) {
          return false;
        }
      }

      if (filters.city.length > 0) {
        const userCityName = cities.find((city) => city.id === user.cityId)?.name;

        if (!userCityName || !filters.city.includes(userCityName)) {
          return false;
        }
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
        categories={skills}
      />

      <div>
        {filteredUsers.map((user) => {
          const cityName =
            cities.find((city) => city.id === user.cityId)?.name ?? 'Неизвестный город';

          return (
            <div key={user.id}>
              {user.name} — {cityName}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogPage;
