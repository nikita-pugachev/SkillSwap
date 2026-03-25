import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import catalogReducer, { setUsers, setSkills, setCities } from '@/services/slices/catalogSlice';
import { useLoadCatalogData } from './useLoadCatalogData';
import type { UserDb, City, SkillCategory, Subcategory } from '@/utils/types';

const mockFetch = jest.fn();
window.fetch = mockFetch;

const createTestStore = () => configureStore({ reducer: { catalog: catalogReducer } });

// мок-данные
const mockSubcategories: Subcategory[] = [];
const mockSkill: SkillCategory = {
  id: 1,
  title: 'Programming',
  icon: 'code',
  slug: 'education',
  subcategories: mockSubcategories,
};

const mockCity: City = {
  id: 1,
  name: 'Moscow',
};

const mockUser: UserDb = {
  id: 1,
  name: 'Test User',
  userAvatar: '/avatar.png',
  cityId: 1,
  gender: 'male' as UserDb['gender'],
  birthday: '1990-01-01',
  about: '',
  skillsTeach: [],
  skillsLearn: [],
  likes: 0,
  createdAt: '',
};

describe('useLoadCatalogData', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('загружает данные при монтировании, если их нет', async () => {
    const store = createTestStore();

    const mockUsers = { users: [mockUser] };
    const mockCities = [mockCity];
    const mockSkills = [mockSkill];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockUsers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
      .mockResolvedValueOnce({ ok: true, json: async () => mockSkills });

    const { unmount } = renderHook(() => useLoadCatalogData(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(store.getState().catalog.users).toEqual(mockUsers.users);
      expect(store.getState().catalog.cities).toEqual(mockCities);
      expect(store.getState().catalog.skills).toEqual(mockSkills);
      expect(store.getState().catalog.loading).toBe(false);
    });
    expect(mockFetch).toHaveBeenCalledTimes(3);
    unmount();
  });

  it('не повторяет загрузку, если данные уже есть', async () => {
    const store = createTestStore();
    store.dispatch(setUsers([mockUser]));
    store.dispatch(setCities([mockCity]));
    store.dispatch(setSkills([mockSkill]));

    const { unmount } = renderHook(() => useLoadCatalogData(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
    });
    unmount();
  });

  it('устанавливает ошибку при сбое', async () => {
    const store = createTestStore();
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { unmount } = renderHook(() => useLoadCatalogData(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(store.getState().catalog.error).toBe('Network error');
      expect(store.getState().catalog.loading).toBe(false);
    });
    unmount();
  });
});
