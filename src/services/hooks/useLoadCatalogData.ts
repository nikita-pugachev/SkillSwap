import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  setUsers,
  setSkills,
  setCities,
  setLoading,
  setError,
} from '@/services/slices/catalogSlice';
import { getCities, getSkills, getUsers } from '@/utils/api';

export const useLoadCatalogData = () => {
  const dispatch = useAppDispatch();
  const { users, skills, cities } = useAppSelector((state) => state.catalog);
  const isLoaded = users.length > 0 && skills.length > 0 && cities.length > 0;
  const isLoadingRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (isLoaded || isLoadingRef.current) return;

    const abortController = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const loadData = async () => {
      isLoadingRef.current = true;
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const [usersData, citiesData, skillsData] = await Promise.all([
          getUsers({ signal: abortController.signal }),
          getCities({ signal: abortController.signal }),
          getSkills({ signal: abortController.signal }),
        ]);

        dispatch(setUsers(usersData));
        dispatch(setCities(citiesData));
        dispatch(setSkills(skillsData));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        dispatch(setError(err instanceof Error ? err.message : 'Неизвестная ошибка'));
      } finally {
        if (requestIdRef.current === requestId) {
          isLoadingRef.current = false;
        }

        if (!abortController.signal.aborted) {
          dispatch(setLoading(false));
        }
      }
    };

    loadData();

    return () => {
      if (requestIdRef.current === requestId) {
        isLoadingRef.current = false;
      }

      abortController.abort();
    };
  }, [dispatch, isLoaded]);
};
