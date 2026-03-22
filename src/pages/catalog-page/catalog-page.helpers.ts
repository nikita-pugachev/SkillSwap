import type {
  Filters,
  SkillCategory,
  SkillCategorySlug,
  UserCardModel,
  UserDb,
} from '@/utils/types';

export type SelectedCollection = 'all' | 'popular' | 'new' | 'exact';
export type SortOrder = 'newest' | 'oldest';
export type FilterChipType = 'mode' | 'gender' | 'city' | 'skill';
type NormalizedGender = 'male' | 'female' | null;
type SubcategoryMeta = {
  title: string;
  categorySlug: SkillCategorySlug;
};

export type FilterChip = {
  key: string;
  label: string;
  type: FilterChipType;
  value: string | number;
};

export type PreparedUser = {
  user: UserDb;
  card: UserCardModel;
  searchableText: string;
  normalizedGender: NormalizedGender;
  cityName: string;
  createdAtTimestamp: number;
  teachSkillIds: number[];
  learnSkillIds: number[];
};

const FALLBACK_SKILL_TITLE = 'Неизвестный навык';
const FALLBACK_CITY_NAME = 'Неизвестный город';

const CATEGORY_MAP: Record<string, SkillCategorySlug> = {
  'Бизнес и карьера': 'business',
  'Творчество и искусство': 'art',
  'Иностранные языки': 'languages',
  'Образование и развитие': 'education',
  'Здоровье и лайфстайл': 'health',
  'Дом и уют': 'home',
};

const getSubcategoryMeta = (
  subcategoryId: number,
  subcategoryMetaById: Map<number, SubcategoryMeta>
): SubcategoryMeta => {
  return (
    subcategoryMetaById.get(subcategoryId) ?? {
      title: FALLBACK_SKILL_TITLE,
      categorySlug: 'other',
    }
  );
};

const hasSkillMatch = (
  mode: Filters['mode'],
  selectedSkills: Set<number>,
  teachSkillIds: number[],
  learnSkillIds: number[]
) => {
  if (selectedSkills.size === 0) {
    return true;
  }

  if (mode === 'wantToLearn') {
    return learnSkillIds.some((skillId) => selectedSkills.has(skillId));
  }

  if (mode === 'canTeach') {
    return teachSkillIds.some((skillId) => selectedSkills.has(skillId));
  }

  return (
    teachSkillIds.some((skillId) => selectedSkills.has(skillId)) ||
    learnSkillIds.some((skillId) => selectedSkills.has(skillId))
  );
};

export const createInitialFilters = (): Filters => ({
  mode: 'all',
  skills: [],
  gender: null,
  city: [],
});

export const normalizeGender = (gender: string | null | undefined): NormalizedGender => {
  if (!gender) {
    return null;
  }

  const value = gender.toLowerCase();

  if (value === 'male' || value === 'мужской') {
    return 'male';
  }

  if (value === 'female' || value === 'женский') {
    return 'female';
  }

  return null;
};

export const getTimestamp = (date: string | undefined): number => {
  if (!date) {
    return 0;
  }

  const timestamp = new Date(date).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const createSubcategoryMetaById = (skills: SkillCategory[]) => {
  const map = new Map<number, SubcategoryMeta>();

  skills.forEach((category) => {
    const categorySlug = CATEGORY_MAP[category.title] ?? 'other';

    category.subcategories.forEach((subcategory) => {
      map.set(subcategory.id, {
        title: subcategory.title,
        categorySlug,
      });
    });
  });

  return map;
};

export const createPreparedUsers = (
  users: UserDb[],
  cityNameById: Map<number, string>,
  subcategoryMetaById: Map<number, SubcategoryMeta>
): PreparedUser[] => {
  return users.map((user) => {
    const cityName = cityNameById.get(user.cityId) ?? FALLBACK_CITY_NAME;
    const teachSkillIds = user.skillsTeach.map((skill) => skill.subcategoryId);
    const teachTitles = user.skillsTeach.map((skill) => skill.customTitle);
    const learnSkillIds = user.skillsLearn;
    const learnSkills = user.skillsLearn.map((skillId) => {
      const meta = getSubcategoryMeta(skillId, subcategoryMetaById);

      return {
        name: meta.title,
        category: meta.categorySlug,
      };
    });

    const card: UserCardModel = {
      id: user.id,
      name: user.name,
      avatar: user.userAvatar,
      city: cityName,
      birthday: user.birthday,
      isFavorite: false,
      skillsTeach: user.skillsTeach.map((skill) => ({
        name: skill.customTitle,
        category: getSubcategoryMeta(skill.subcategoryId, subcategoryMetaById).categorySlug,
      })),
      skillsLearn: learnSkills,
      likes: user.likes,
    };

    return {
      user,
      card,
      searchableText: [
        user.name,
        cityName,
        ...teachTitles,
        ...learnSkills.map((skill) => skill.name),
      ]
        .join(' ')
        .toLowerCase(),
      normalizedGender: normalizeGender(user.gender),
      cityName,
      createdAtTimestamp: getTimestamp(user.createdAt),
      teachSkillIds,
      learnSkillIds,
    };
  });
};

export const filterPreparedUsers = (
  preparedUsers: PreparedUser[],
  filters: Filters,
  search: string
) => {
  const searchValue = search.trim().toLowerCase();
  const selectedCities = new Set(filters.city);
  const selectedSkills = new Set(filters.skills);
  const normalizedFilterGender = normalizeGender(filters.gender);

  return preparedUsers.filter(
    ({ cityName, searchableText, normalizedGender, teachSkillIds, learnSkillIds }) => {
      const matchesSearch = !searchValue || searchableText.includes(searchValue);
      const matchesGender = !normalizedFilterGender || normalizedGender === normalizedFilterGender;
      const matchesCity = selectedCities.size === 0 || selectedCities.has(cityName);
      const matchesSkills = hasSkillMatch(
        filters.mode,
        selectedSkills,
        teachSkillIds,
        learnSkillIds
      );

      return matchesSearch && matchesGender && matchesCity && matchesSkills;
    }
  );
};

export const filterPreparedUsersByTeachSkillMatch = (
  preparedUsers: PreparedUser[],
  requestedSkillIds: number[],
  excludedUserId?: number
) => {
  if (requestedSkillIds.length === 0) {
    return [];
  }

  const requestedSkillIdsSet = new Set(requestedSkillIds);

  return preparedUsers.filter(({ user, teachSkillIds }) => {
    if (excludedUserId && user.id === excludedUserId) {
      return false;
    }

    return teachSkillIds.some((skillId) => requestedSkillIdsSet.has(skillId));
  });
};

export const sortPreparedUsersByDate = (users: PreparedUser[], sortOrder: SortOrder) => {
  return [...users].sort((firstUser, secondUser) => {
    return sortOrder === 'newest'
      ? secondUser.createdAtTimestamp - firstUser.createdAtTimestamp
      : firstUser.createdAtTimestamp - secondUser.createdAtTimestamp;
  });
};

export const countActiveFilters = (filters: Filters) => {
  let count = 0;

  if (filters.mode !== 'all') {
    count += 1;
  }

  if (filters.gender) {
    count += 1;
  }

  count += filters.city.length;
  count += filters.skills.length;

  return count;
};

export const buildActiveFilterChips = (
  filters: Filters,
  subcategoryMetaById: Map<number, SubcategoryMeta>
): FilterChip[] => {
  const chips: FilterChip[] = [];

  if (filters.mode === 'wantToLearn') {
    chips.push({
      key: 'mode-wantToLearn',
      label: 'Хочу научиться',
      type: 'mode',
      value: 'wantToLearn',
    });
  }

  if (filters.mode === 'canTeach') {
    chips.push({
      key: 'mode-canTeach',
      label: 'Могу научить',
      type: 'mode',
      value: 'canTeach',
    });
  }

  if (filters.gender) {
    chips.push({
      key: `gender-${filters.gender}`,
      label: filters.gender,
      type: 'gender',
      value: filters.gender,
    });
  }

  filters.city.forEach((cityName) => {
    chips.push({
      key: `city-${cityName}`,
      label: cityName,
      type: 'city',
      value: cityName,
    });
  });

  filters.skills.forEach((skillId) => {
    chips.push({
      key: `skill-${skillId}`,
      label: getSubcategoryMeta(skillId, subcategoryMetaById).title,
      type: 'skill',
      value: skillId,
    });
  });

  return chips;
};

export const getCollectionTitle = (selectedCollection: SelectedCollection) => {
  if (selectedCollection === 'exact') {
    return 'Точное совпадение';
  }

  if (selectedCollection === 'popular') {
    return 'Популярные пользователи';
  }

  if (selectedCollection === 'new') {
    return 'Новые пользователи';
  }

  return 'Подходящие предложения';
};
