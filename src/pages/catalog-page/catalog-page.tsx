import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Button, CardSection } from '@/components/ui';
import { getAuthenticatedUserId } from '@/utils/auth';
import { getCities, getSkills, getUsers } from '@/utils/api';
import type { City, Filters, SkillCategory, UserCardModel, UserDb } from '@/utils/types';
import { CatalogEmpty } from './components/CatalogEmpty';
import { CatalogLoading } from './components/CatalogLoading';
import { CatalogError } from './components/CatalogError';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import CrossIcon from '@/assets/icons/cross.svg?react';
import SortIcon from '@/assets/icons/sort.svg?react';

import {
  type FilterChip,
  type SelectedCollection,
  type SortOrder,
  buildActiveFilterChips,
  countActiveFilters,
  createInitialFilters,
  createPreparedUsers,
  createSubcategoryMetaById,
  filterPreparedUsers,
  filterPreparedUsersByTeachSkillMatch,
  getCollectionTitle,
  sortPreparedUsersByDate,
} from './catalog-page.helpers';
import styles from './catalog-page.module.scss';

type LayoutOutletContext = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

type CatalogDataState = {
  skills: SkillCategory[];
  cities: City[];
  users: UserDb[];
  loading: boolean;
  error: string | null;
};

type HomeSection = {
  title: string;
  cards: UserCardModel[];
  buttonText?: string;
  onActionClick?: () => void;
};

const CATALOG_FILTERS_STORAGE_KEY = 'catalogFilters';

const getPersistedFilters = (): Filters => {
  const storedFilters = localStorage.getItem(CATALOG_FILTERS_STORAGE_KEY);

  if (!storedFilters) {
    return createInitialFilters();
  }

  try {
    const parsedFilters = JSON.parse(storedFilters) as Partial<Filters>;

    const mode =
      parsedFilters.mode === 'all' ||
      parsedFilters.mode === 'wantToLearn' ||
      parsedFilters.mode === 'canTeach'
        ? parsedFilters.mode
        : 'all';

    const gender =
      parsedFilters.gender === 'Мужской' || parsedFilters.gender === 'Женский'
        ? parsedFilters.gender
        : null;

    const city = Array.isArray(parsedFilters.city)
      ? parsedFilters.city.filter((value): value is string => typeof value === 'string')
      : [];

    const skills = Array.isArray(parsedFilters.skills)
      ? parsedFilters.skills.filter((value): value is number => typeof value === 'number')
      : [];

    return {
      mode,
      gender,
      city,
      skills,
    };
  } catch {
    return createInitialFilters();
  }
};

const useCatalogData = (): CatalogDataState => {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [users, setUsers] = useState<UserDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [skillsData, citiesData, usersData] = await Promise.all([
          getSkills({ signal: abortController.signal }),
          getCities({ signal: abortController.signal }),
          getUsers({ signal: abortController.signal }),
        ]);

        setSkills(skillsData);
        setCities(citiesData);
        setUsers(usersData);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      abortController.abort();
    };
  }, []);

  return { skills, cities, users, loading, error };
};

export const CatalogPage = () => {
  const { searchQuery, setSearchQuery } = useOutletContext<LayoutOutletContext>();

  const [filters, setFilters] = useState<Filters>(getPersistedFilters);
  const [selectedCollection, setSelectedCollection] = useState<SelectedCollection>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const { skills, cities, users, loading, error } = useCatalogData();

  const authenticatedUserId = getAuthenticatedUserId();
  const isAuthenticated = authenticatedUserId !== null;
  const hasSearchQuery = searchQuery.trim().length > 0;

  const cityNameById = useMemo(() => {
    return new Map(cities.map((city) => [city.id, city.name]));
  }, [cities]);

  const cityOptions = useMemo(() => {
    return cities.map((city) => city.name);
  }, [cities]);

  const subcategoryMetaById = useMemo(() => {
    return createSubcategoryMetaById(skills);
  }, [skills]);

  const preparedUsers = useMemo(() => {
    return createPreparedUsers(users, cityNameById, subcategoryMetaById);
  }, [users, cityNameById, subcategoryMetaById]);

  const authenticatedUser = useMemo(() => {
    if (!authenticatedUserId) {
      return null;
    }

    return users.find((user) => user.id === authenticatedUserId) ?? null;
  }, [authenticatedUserId, users]);

  const filteredUsers = useMemo(() => {
    return filterPreparedUsers(preparedUsers, filters, searchQuery);
  }, [preparedUsers, filters, searchQuery]);

  const exactMatchUsers = useMemo(() => {
    if (!authenticatedUser) {
      return [];
    }

    return filterPreparedUsersByTeachSkillMatch(
      filteredUsers,
      authenticatedUser.skillsLearn,
      authenticatedUser.id
    );
  }, [authenticatedUser, filteredUsers]);

  const recommendedCards = useMemo(() => {
    return filteredUsers.map(({ card }) => card);
  }, [filteredUsers]);

  const popularUsers = useMemo(() => {
    return [...filteredUsers].sort(
      (firstUser, secondUser) => secondUser.card.likes - firstUser.card.likes
    );
  }, [filteredUsers]);

  const newUsers = useMemo(() => {
    return sortPreparedUsersByDate(filteredUsers, 'newest');
  }, [filteredUsers]);

  const defaultUsers = useMemo(() => {
    return sortPreparedUsersByDate(filteredUsers, sortOrder);
  }, [filteredUsers, sortOrder]);

  const collectionUsers = useMemo(() => {
    if (selectedCollection === 'exact') {
      return exactMatchUsers;
    }

    if (selectedCollection === 'popular') {
      return popularUsers;
    }

    if (selectedCollection === 'new') {
      return newUsers;
    }

    return defaultUsers;
  }, [defaultUsers, exactMatchUsers, newUsers, popularUsers, selectedCollection]);

  const collectionCards = useMemo(() => {
    return collectionUsers.map(({ card }) => card);
  }, [collectionUsers]);

  const exactMatchUsersPreview = useMemo(() => {
    return exactMatchUsers.slice(0, 3).map(({ card }) => card);
  }, [exactMatchUsers]);

  const popularUsersPreview = useMemo(() => {
    return popularUsers.slice(0, 3).map(({ card }) => card);
  }, [popularUsers]);

  const newUsersPreview = useMemo(() => {
    return newUsers.slice(0, 3).map(({ card }) => card);
  }, [newUsers]);

  const activeFiltersCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);

  const activeFilterChips = useMemo(() => {
    return buildActiveFilterChips(filters, subcategoryMetaById);
  }, [filters, subcategoryMetaById]);

  const hasActiveFilters = activeFiltersCount > 0 || hasSearchQuery || selectedCollection !== 'all';

  useEffect(() => {
    if (countActiveFilters(filters) === 0) {
      localStorage.removeItem(CATALOG_FILTERS_STORAGE_KEY);
      return;
    }

    localStorage.setItem(CATALOG_FILTERS_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const handleToggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'));
  }, []);

  const clearSearchQuery = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const removeFilterChip = useCallback((chip: Pick<FilterChip, 'type' | 'value'>) => {
    setFilters((prev) => {
      switch (chip.type) {
        case 'mode':
          return { ...prev, mode: 'all' };

        case 'gender':
          return { ...prev, gender: null };

        case 'city':
          return {
            ...prev,
            city: prev.city.filter((cityName) => cityName !== chip.value),
          };

        case 'skill':
          return {
            ...prev,
            skills: prev.skills.filter((skillId) => skillId !== chip.value),
          };

        default:
          return prev;
      }
    });
  }, []);

  const handleShowAllPopular = useCallback(() => {
    setSelectedCollection('popular');
  }, []);

  const handleShowAllExact = useCallback(() => {
    setSelectedCollection('exact');
  }, []);

  const handleShowAllNew = useCallback(() => {
    setSelectedCollection('new');
  }, []);

  const handleBackToCatalog = useCallback(() => {
    setSelectedCollection('all');
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters(createInitialFilters());
    setSelectedCollection('all');
    setSortOrder('newest');
  }, [setSearchQuery]);

  const collectionTitle =
    isAuthenticated && selectedCollection === 'new'
      ? 'Новые идеи'
      : getCollectionTitle(selectedCollection);

  const homeSections = useMemo<HomeSection[]>(() => {
    const primarySectionTitle = isAuthenticated ? 'Точное совпадение' : 'Популярное';
    const secondarySectionTitle = isAuthenticated ? 'Новые идеи' : 'Новое';
    const primarySectionCards = isAuthenticated ? exactMatchUsersPreview : popularUsersPreview;
    const primarySectionAction = isAuthenticated ? handleShowAllExact : handleShowAllPopular;

    return [
      {
        title: primarySectionTitle,
        buttonText: 'Смотреть все',
        cards: primarySectionCards,
        onActionClick: primarySectionAction,
      },
      {
        title: secondarySectionTitle,
        buttonText: 'Смотреть все',
        cards: newUsersPreview,
        onActionClick: handleShowAllNew,
      },
      {
        title: 'Рекомендуем',
        cards: recommendedCards,
      },
    ];
  }, [
    exactMatchUsersPreview,
    handleShowAllExact,
    handleShowAllNew,
    handleShowAllPopular,
    isAuthenticated,
    newUsersPreview,
    popularUsersPreview,
    recommendedCards,
  ]);

  if (loading) {
    return <CatalogLoading />;
  }

  if (error) {
    return <CatalogError message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className={styles.content}>
      <aside>
        <FilterSidebar
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          canReset={hasActiveFilters}
          onReset={resetFilters}
          onChange={handleFiltersChange}
          categories={skills}
          cities={cityOptions}
        />
      </aside>

      <section className={styles.main}>
        {hasActiveFilters ? (
          <>
            {(hasSearchQuery || activeFilterChips.length > 0) && (
              <div className={styles.selectedFilters}>
                {hasSearchQuery && (
                  <Button
                    variant="tertiary"
                    className={styles.filterChip}
                    onClick={clearSearchQuery}
                  >
                    {searchQuery}
                    <CrossIcon className={styles.filterChipClose} aria-hidden="true" />
                  </Button>
                )}

                {activeFilterChips.map((chip) => (
                  <Button
                    key={chip.key}
                    variant="tertiary"
                    className={styles.filterChip}
                    onClick={() => removeFilterChip(chip)}
                  >
                    {chip.label}
                    <CrossIcon className={styles.filterChipClose} aria-hidden="true" />
                  </Button>
                ))}
              </div>
            )}

            <div className={styles.resultsHeader}>
              <h1 className={styles.resultsTitle}>
                {collectionTitle}: {collectionCards.length}
              </h1>

              {(selectedCollection === 'exact' ||
                selectedCollection === 'popular' ||
                selectedCollection === 'new') && (
                <Button
                  variant="tertiary"
                  className={styles.backButton}
                  onClick={handleBackToCatalog}
                >
                  <ChevronLeftIcon className={styles.icon} />
                  Вернуться назад
                </Button>
              )}

              {selectedCollection === 'all' && (
                <Button
                  variant="tertiary"
                  className={styles.sortButton}
                  onClick={handleToggleSortOrder}
                >
                  <SortIcon className={styles.icon} />
                  {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
                </Button>
              )}
            </div>

            {collectionCards.length === 0 ? (
              <CatalogEmpty />
            ) : (
              <CardSection cards={collectionCards} isLogin={isAuthenticated} />
            )}
          </>
        ) : (
          <>
            {recommendedCards.length === 0 ? (
              <CatalogEmpty />
            ) : (
              homeSections.map((section) => (
                <CardSection
                  key={section.title}
                  title={section.title}
                  buttonText={section.buttonText}
                  cards={section.cards}
                  onActionClick={section.onActionClick}
                  isLogin={isAuthenticated}
                />
              ))
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default CatalogPage;
