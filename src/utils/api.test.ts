import { getSkills, getUsersFromDb } from './api';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch as typeof fetch;

describe('API Service - getSkills', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('успешно загружает данные', async () => {
    const mockSkills = [{ id: 1, title: 'Бизнес', icon: 'icon.svg', subcategories: [] }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSkills,
    });

    const result = await getSkills();

    expect(mockFetch).toHaveBeenCalledWith('/db/skills.json', undefined);
    expect(result).toEqual(mockSkills);
  });

  test('обрабатывает ошибку при response.ok === false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found' }),
    });

    await expect(getSkills()).rejects.toThrow('Not found');
    expect(mockFetch).toHaveBeenCalledWith('/db/skills.json', undefined);
  });

  test('обрабатывает ошибку при reject у fetch', async () => {
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(getSkills()).rejects.toThrow('Network error');
    expect(mockFetch).toHaveBeenCalledWith('/db/skills.json', undefined);
  });
});

describe('API Service - getUsersFromDb', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('успешно загружает пользователей', async () => {
    const mockUsers = {
      users: [
        {
          id: 1,
          name: 'Иван',
          userAvatar: '/a.png',
          cityId: 1,
          gender: 'male',
          birthday: '',
          about: '',
          skillsTeach: [],
          skillsLearn: [],
          likes: 0,
          createdAt: '',
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const result = await getUsersFromDb();

    expect(mockFetch).toHaveBeenCalledWith('/db/users.json');
    expect(result).toEqual(mockUsers.users);
  });
});
