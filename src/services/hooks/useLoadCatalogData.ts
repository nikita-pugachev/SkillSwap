import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  setUsers,
  setSkills,
  setCities,
  setLoading,
  setError,
} from '@/services/slices/catalogSlice';
import { UserDb, City, SkillCategory } from '@/utils/types';

export const useLoadCatalogData = () => {
  const dispatch = useAppDispatch();
  const { users, skills, cities } = useAppSelector((state) => state.catalog);
  const isLoaded = users.length > 0 && skills.length > 0 && cities.length > 0;
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (isLoaded || isLoadingRef.current) return;

    const loadData = async () => {
      isLoadingRef.current = true;
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const [usersRes, citiesRes, skillsRes] = await Promise.all([
          fetch('/db/users.json'),
          fetch('/db/cities.json'),
          fetch('/db/skills.json'),
        ]);

        if (!usersRes.ok) throw new Error('Ошибка загрузки пользователей');
        if (!citiesRes.ok) throw new Error('Ошибка загрузки городов');
        if (!skillsRes.ok) throw new Error('Ошибка загрузки навыков');

        const usersData: { users: UserDb[] } = await usersRes.json();
        const citiesData: City[] = await citiesRes.json();
        const skillsData: SkillCategory[] = await skillsRes.json();

        dispatch(setUsers(usersData.users));
        dispatch(setCities(citiesData));
        dispatch(setSkills(skillsData));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Неизвестная ошибка'));
      } finally {
        dispatch(setLoading(false));
        isLoadingRef.current = false;
      }
    };

    loadData();
  }, [dispatch, isLoaded]);
};
