import { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
import type { SkillCategoryData } from '@/components/FilterSidebar';
import { CatalogLoading, CatalogError, CatalogEmpty } from './components';

type User = {
  id: number;
  name: string;
  cityId: number;
  gender: 'male' | 'female';
  skillsTeach: {
    id: number;
    subcategoryId: number;
  }[];
  skillsLearn: number[];
};

type City = {
  id: number;
  name: string;
};

type Filters = {
  mode: 'all' | 'wantToLearn' | 'canTeach';
  skills: number[];
  gender: 'Мужской' | 'Женский' | null;
  city: string[];
};

export const CatalogPage = () => {
  const [filters, setFilters] = useState<Filters>({
    mode: 'all',
    skills: [],
    gender: null,
    city: [],
  });

  const [skills, setSkills] = useState<SkillCategoryData[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функции загрузки отдельных данных
  const fetchSkills = useCallback(async () => {
    const res = await fetch('/db/skills.json');
    if (!res.ok) throw new Error('Ошибка загрузки навыков');
    const data: SkillCategoryData[] = await res.json();
    setSkills(data);
  }, []);

  const fetchCities = useCallback(async () => {
    const res = await fetch('/db/cities.json');
    if (!res.ok) throw new Error('Ошибка загрузки городов');
    const data: City[] = await res.json();
    setCities(data);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/db/users.json');
    if (!res.ok) throw new Error('Ошибка загрузки пользователей');
    const data: { users: User[] } = await res.json();
    setUsers(data.users);
  }, []);

  // Общая функция загрузки всех данных
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchSkills(), fetchCities(), fetchUsers()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [fetchSkills, fetchCities, fetchUsers]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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

  const handleResetFilters = () => {
    setFilters({
      mode: 'all',
      skills: [],
      gender: null,
      city: [],
    });
  };

  const renderContent = () => {
    if (loading) return <CatalogLoading />;
    if (error) return <CatalogError message={error} onRetry={fetchAllData} />;
    if (filteredUsers.length === 0) return <CatalogEmpty onResetFilters={handleResetFilters} />;
    return (
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
    );
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <FilterSidebar
        filters={filters}
        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        cities={cities.map((city) => city.name)}
        categories={skills}
      />
      {renderContent()}
    </div>
  );
};

export default CatalogPage;
