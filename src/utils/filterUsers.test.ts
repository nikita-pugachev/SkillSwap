import { filterByGender, filterByCity, filterByMode, filterUsers } from './filterUsers';
import type { UserFromDb, City, Filters } from './types';

const makeUser = (overrides: Partial<UserFromDb> = {}): UserFromDb => ({
  id: 1,
  name: 'Иван',
  email: 'ivan@example.com',
  password: 'password',
  userAvatar: '',
  cityId: 1,
  gender: 'male',
  birthday: '1990-01-01',
  about: '',
  skillsTeach: [],
  skillsLearn: [],
  likes: 0,
  createdAt: '2026-01-01',
  ...overrides,
});

const cities: City[] = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
];

const baseFilters: Filters = {
  mode: 'all',
  skills: [],
  gender: null,
  city: [],
};

describe('filterByGender', () => {
  it('возвращает true если фильтр пол не задан', () => {
    expect(filterByGender(makeUser({ gender: 'male' }), null)).toBe(true);
  });

  it('пропускает пользователя с совпадающим полом', () => {
    expect(filterByGender(makeUser({ gender: 'male' }), 'Мужской')).toBe(true);
    expect(filterByGender(makeUser({ gender: 'female' }), 'Женский')).toBe(true);
  });

  it('отфильтровывает пользователя с несовпадающим полом', () => {
    expect(filterByGender(makeUser({ gender: 'male' }), 'Женский')).toBe(false);
    expect(filterByGender(makeUser({ gender: 'female' }), 'Мужской')).toBe(false);
  });
});

describe('filterByCity', () => {
  it('возвращает true если список городов пустой', () => {
    expect(filterByCity(makeUser({ cityId: 1 }), cities, [])).toBe(true);
  });

  it('пропускает пользователя из выбранного города', () => {
    expect(filterByCity(makeUser({ cityId: 1 }), cities, ['Москва'])).toBe(true);
  });

  it('отфильтровывает пользователя не из выбранного города', () => {
    expect(filterByCity(makeUser({ cityId: 2 }), cities, ['Москва'])).toBe(false);
  });

  it('пропускает пользователя если его город входит в множественный выбор', () => {
    expect(filterByCity(makeUser({ cityId: 2 }), cities, ['Москва', 'Санкт-Петербург'])).toBe(true);
  });

  it('возвращает false если cityId пользователя не найден в cities', () => {
    expect(filterByCity(makeUser({ cityId: 99 }), cities, ['Москва'])).toBe(false);
  });
});

describe('filterByMode', () => {
  const teachUser = makeUser({
    skillsTeach: [
      { id: 1001, customTitle: 'Английский', subcategoryId: 101, description: '', images: [] },
    ],
    skillsLearn: [201],
  });

  it('возвращает true для режима all при любом наборе навыков', () => {
    expect(filterByMode(makeUser(), 'all', [])).toBe(true);
    expect(filterByMode(makeUser(), 'all', [101, 201])).toBe(true);
  });

  it('wantToLearn: пропускает пользователя у которого нет ограничения по навыкам', () => {
    expect(filterByMode(teachUser, 'wantToLearn', [])).toBe(true);
  });

  it('wantToLearn: пропускает пользователя у которого совпадает навык из skillsLearn', () => {
    expect(filterByMode(teachUser, 'wantToLearn', [201])).toBe(true);
  });

  it('wantToLearn: отфильтровывает пользователя без нужного навыка', () => {
    expect(filterByMode(teachUser, 'wantToLearn', [999])).toBe(false);
  });

  it('canTeach: пропускает пользователя у которого нет ограничения по навыкам', () => {
    expect(filterByMode(teachUser, 'canTeach', [])).toBe(true);
  });

  it('canTeach: пропускает пользователя у которого совпадает subcategoryId из skillsTeach', () => {
    expect(filterByMode(teachUser, 'canTeach', [101])).toBe(true);
  });

  it('canTeach: отфильтровывает пользователя без нужного навыка', () => {
    expect(filterByMode(teachUser, 'canTeach', [999])).toBe(false);
  });
});

describe('filterUsers', () => {
  const users: UserFromDb[] = [
    makeUser({
      id: 1,
      gender: 'male',
      cityId: 1,
      skillsTeach: [
        { id: 1001, customTitle: 'Английский', subcategoryId: 101, description: '', images: [] },
      ],
      skillsLearn: [201],
    }),
    makeUser({
      id: 2,
      gender: 'female',
      cityId: 2,
      skillsTeach: [
        { id: 1002, customTitle: 'Маркетинг', subcategoryId: 201, description: '', images: [] },
      ],
      skillsLearn: [101],
    }),
  ];

  it('возвращает всех пользователей при пустых фильтрах', () => {
    expect(filterUsers(users, baseFilters, cities)).toHaveLength(2);
  });

  it('возвращает пустой массив при пустом входном массиве', () => {
    expect(filterUsers([], baseFilters, cities)).toHaveLength(0);
  });

  it('фильтрует только по поиску (gender)', () => {
    const result = filterUsers(users, { ...baseFilters, gender: 'Мужской' }, cities);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('фильтрует только по городу', () => {
    const result = filterUsers(users, { ...baseFilters, city: ['Москва'] }, cities);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('фильтрует только по типу canTeach', () => {
    const result = filterUsers(users, { ...baseFilters, mode: 'canTeach', skills: [101] }, cities);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('фильтрует только по типу wantToLearn', () => {
    const result = filterUsers(
      users,
      { ...baseFilters, mode: 'wantToLearn', skills: [201] },
      cities
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('комбинирует несколько фильтров одновременно', () => {
    const result = filterUsers(
      users,
      { mode: 'canTeach', skills: [101], gender: 'Мужской', city: ['Москва'] },
      cities
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('возвращает пустой массив если нет совпадений', () => {
    const result = filterUsers(
      users,
      { ...baseFilters, gender: 'Мужской', city: ['Санкт-Петербург'] },
      cities
    );
    expect(result).toHaveLength(0);
  });

  it('возвращает всех пользователей при mode=all без навыков', () => {
    const result = filterUsers(users, { ...baseFilters, mode: 'all', skills: [] }, cities);
    expect(result).toHaveLength(2);
  });

  it('возвращает всех пользователей при пустой строке поиска (пустой город)', () => {
    const result = filterUsers(users, { ...baseFilters, city: [] }, cities);
    expect(result).toHaveLength(2);
  });
});
