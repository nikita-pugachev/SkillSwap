import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
import { CatalogLoading, CatalogError, CatalogEmpty } from './components';
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

  const latestRequest = useRef(0);

  const fetchSkills = useCallback(async (requestId: number) => {
    const data = await getSkills();
    if (requestId === latestRequest.current) {
      setSkills(data);
    }
  }, []);

  const fetchCities = useCallback(async (requestId: number) => {
    const res = await fetch('/db/cities.json');
    if (!res.ok) {
      throw new Error('Ошибка загрузки городов');
    }

    const data: City[] = await res.json();

    if (requestId === latestRequest.current) {
      setCities(data);
    }
  }, []);

  const fetchUsers = useCallback(async (requestId: number) => {
    const res = await fetch('/db/users.json');
    if (!res.ok) {
      throw new Error('Ошибка загрузки пользователей');
    }

    const data: { users: UserFromDb[] } = await res.json();

    if (requestId === latestRequest.current) {
      setUsers(data.users);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    const requestId = ++latestRequest.current;

    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchSkills(requestId), fetchCities(requestId), fetchUsers(requestId)]);

      if (requestId !== latestRequest.current) {
        return;
      }
    } catch (err: unknown) {
      if (requestId === latestRequest.current) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      }
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
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

  if (loading) {
    return <CatalogLoading />;
  }

  if (error) {
    return <CatalogError message={error} onRetry={fetchAllData} />;
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <FilterSidebar
        filters={filters}
        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        cities={cities.map((city) => city.name)}
        categories={skills}
      />

      {filteredUsers.length === 0 ? (
        <CatalogEmpty />
      ) : (
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
      )}
    </div>
  );
};

export default CatalogPage;
