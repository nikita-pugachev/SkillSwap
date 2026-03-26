import type { Filters, SkillCategory, UserDb } from '@/utils/types';
import {
  createInitialFilters,
  createPreparedUsers,
  createSubcategoryMetaById,
  filterPreparedUsers,
  filterPreparedUsersByTeachSkillMatch,
  countActiveFilters,
  buildActiveFilterChips,
} from './catalog-page.helpers';

const skills: SkillCategory[] = [
  {
    id: 1,
    title: 'Иностранные языки',
    icon: 'languages',
    slug: 'languages',
    subcategories: [
      { id: 10, title: 'Английский' },
      { id: 11, title: 'Испанский' },
    ],
  },
  {
    id: 2,
    title: 'Творчество и искусство',
    icon: 'art',
    slug: 'art',
    subcategories: [{ id: 20, title: 'Рисование' }],
  },
];

const cityNameById = new Map<number, string>([
  [1, 'Москва'],
  [2, 'Казань'],
]);

const users: UserDb[] = [
  {
    id: 1,
    name: 'Анна',
    userAvatar: '/anna.png',
    cityId: 1,
    gender: 'Женский',
    birthday: '1990-01-01',
    about: 'О себе',
    skillsTeach: [
      {
        id: 1,
        customTitle: 'Рисование акварелью',
        subcategoryId: 20,
        description: 'Научу рисовать',
        images: [],
      },
    ],
    skillsLearn: [10],
    likes: 5,
    createdAt: '2024-03-01',
  },
  {
    id: 2,
    name: 'Борис',
    userAvatar: '/boris.png',
    cityId: 2,
    gender: 'Мужской',
    birthday: '1988-06-10',
    about: 'Люблю языки',
    skillsTeach: [
      {
        id: 2,
        customTitle: 'Разговорный английский',
        subcategoryId: 10,
        description: 'Практика разговорной речи',
        images: [],
      },
    ],
    skillsLearn: [20],
    likes: 15,
    createdAt: '2024-04-01',
  },
  {
    id: 3,
    name: 'Вера',
    userAvatar: '/vera.png',
    cityId: 1,
    gender: 'Женский',
    birthday: '1992-04-12',
    about: 'Ищу обмен навыками',
    skillsTeach: [
      {
        id: 3,
        customTitle: 'Испанский для путешествий',
        subcategoryId: 11,
        description: 'Базовый испанский',
        images: [],
      },
    ],
    skillsLearn: [20],
    likes: 10,
    createdAt: '2024-02-01',
  },
];

const subcategoryMetaById = createSubcategoryMetaById(skills);

const preparedUsers = createPreparedUsers(users, cityNameById, subcategoryMetaById);

describe('catalog-page.helpers', () => {
  describe('createInitialFilters', () => {
    it('returns the default filters state', () => {
      expect(createInitialFilters()).toEqual({
        mode: 'all',
        skills: [],
        gender: null,
        city: [],
      });
    });
  });

  describe('filterPreparedUsers', () => {
    it('returns all users when filters and search are empty', () => {
      const filters = createInitialFilters();

      const result = filterPreparedUsers(preparedUsers, filters, '');

      expect(result.map(({ user }) => user.id)).toEqual([1, 2, 3]);
    });

    it('filters only by search', () => {
      const filters = createInitialFilters();

      const result = filterPreparedUsers(preparedUsers, filters, 'англий');

      expect(result.map(({ user }) => user.id)).toEqual([1, 2]);
    });

    it('filters only by city', () => {
      const filters: Filters = {
        ...createInitialFilters(),
        city: ['Москва'],
      };

      const result = filterPreparedUsers(preparedUsers, filters, '');

      expect(result.map(({ user }) => user.id)).toEqual([1, 3]);
    });

    it('filters only by mode canTeach', () => {
      const filters: Filters = {
        ...createInitialFilters(),
        mode: 'canTeach',
        skills: [10],
      };

      const result = filterPreparedUsers(preparedUsers, filters, '');

      expect(result.map(({ user }) => user.id)).toEqual([2]);
    });

    it('filters only by mode wantToLearn', () => {
      const filters: Filters = {
        ...createInitialFilters(),
        mode: 'wantToLearn',
        skills: [10],
      };

      const result = filterPreparedUsers(preparedUsers, filters, '');

      expect(result.map(({ user }) => user.id)).toEqual([1]);
    });

    it('combines search and city by AND logic', () => {
      const filters: Filters = {
        ...createInitialFilters(),
        city: ['Москва'],
      };

      const result = filterPreparedUsers(preparedUsers, filters, 'англий');

      expect(result.map(({ user }) => user.id)).toEqual([1]);
    });

    it('returns empty array when there are no matches', () => {
      const filters: Filters = {
        ...createInitialFilters(),
        city: ['Казань'],
        gender: 'Женский',
      };

      const result = filterPreparedUsers(preparedUsers, filters, 'рисование');

      expect(result).toEqual([]);
    });

    it('returns empty array for empty input array', () => {
      const result = filterPreparedUsers([], createInitialFilters(), 'anything');

      expect(result).toEqual([]);
    });

    it('does not mutate source prepared users array', () => {
      const source = [...preparedUsers];
      const snapshot = structuredClone(source);

      filterPreparedUsers(source, { ...createInitialFilters(), city: ['Москва'] }, 'англий');

      expect(source).toEqual(snapshot);
    });
  });

  describe('filterPreparedUsersByTeachSkillMatch', () => {
    it('returns users who can teach requested skills', () => {
      const result = filterPreparedUsersByTeachSkillMatch(preparedUsers, [10]);

      expect(result.map(({ user }) => user.id)).toEqual([2]);
    });

    it('excludes current user when excludedUserId is passed', () => {
      const result = filterPreparedUsersByTeachSkillMatch(preparedUsers, [20], 1);

      expect(result.map(({ user }) => user.id)).toEqual([]);
    });

    it('returns empty array when requested skills are empty', () => {
      expect(filterPreparedUsersByTeachSkillMatch(preparedUsers, [])).toEqual([]);
    });

    it('does not mutate source prepared users array', () => {
      const source = [...preparedUsers];
      const snapshot = structuredClone(source);

      filterPreparedUsersByTeachSkillMatch(source, [10]);

      expect(source).toEqual(snapshot);
    });
  });

  describe('countActiveFilters', () => {
    it('counts all active filters except search', () => {
      const filters: Filters = {
        mode: 'canTeach',
        gender: 'Мужской',
        city: ['Москва', 'Казань'],
        skills: [10, 20],
      };

      expect(countActiveFilters(filters)).toBe(6);
    });

    it('returns zero for initial filters', () => {
      expect(countActiveFilters(createInitialFilters())).toBe(0);
    });
  });

  describe('buildActiveFilterChips', () => {
    it('builds chips for active filters', () => {
      const filters: Filters = {
        mode: 'canTeach',
        gender: 'Мужской',
        city: ['Москва'],
        skills: [10],
      };

      const chips = buildActiveFilterChips(filters, subcategoryMetaById);

      expect(chips).toEqual([
        {
          key: 'mode-canTeach',
          label: 'Могу научить',
          type: 'mode',
          value: 'canTeach',
        },
        {
          key: 'gender-Мужской',
          label: 'Мужской',
          type: 'gender',
          value: 'Мужской',
        },
        {
          key: 'city-Москва',
          label: 'Москва',
          type: 'city',
          value: 'Москва',
        },
        {
          key: 'skill-10',
          label: 'Английский',
          type: 'skill',
          value: 10,
        },
      ]);
    });

    it('returns empty array for initial filters', () => {
      expect(buildActiveFilterChips(createInitialFilters(), subcategoryMetaById)).toEqual([]);
    });
  });
});
