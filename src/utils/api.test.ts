/* global global */
import { getSkills } from './api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

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

    expect(mockFetch).toHaveBeenCalledWith('/db/skills.json');
    expect(result).toEqual(mockSkills);
  });

  test('обрабатывает ошибку при response.ok === false', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found' }),
    });

    await expect(getSkills()).rejects.toThrow('Not found');
    expect(mockFetch).toHaveBeenCalledWith('/db/skills.json');
  });

  test('обрабатывает ошибку при reject у fetch', async () => {
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(getSkills()).rejects.toThrow('Network error');
    expect(mockFetch).toHaveBeenCalledWith('/db/skills.json');
  });
});
