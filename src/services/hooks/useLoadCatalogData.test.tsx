import { StrictMode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { getCities, getSkills, getUsers } from '@/utils/api';
import catalogReducer, { setCities, setSkills, setUsers } from '@/services/slices/catalogSlice';
import { useLoadCatalogData } from './useLoadCatalogData';
import type { City, SkillCategory, Subcategory, UserDb } from '@/utils/types';

jest.mock('@/utils/api', () => ({
  getUsers: jest.fn(),
  getCities: jest.fn(),
  getSkills: jest.fn(),
}));

const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockedGetCities = getCities as jest.MockedFunction<typeof getCities>;
const mockedGetSkills = getSkills as jest.MockedFunction<typeof getSkills>;

const createTestStore = () => configureStore({ reducer: { catalog: catalogReducer } });
type CatalogRequestInit = Parameters<typeof getUsers>[0];

const createAbortAwareMock = <T,>(data: T) =>
  jest.fn((init?: CatalogRequestInit) => {
    return new Promise<T>((resolve, reject) => {
      const signal = init?.signal;

      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }

      const handleAbort = () => {
        reject(new DOMException('Aborted', 'AbortError'));
      };

      signal?.addEventListener('abort', handleAbort, { once: true });

      setTimeout(() => {
        signal?.removeEventListener('abort', handleAbort);

        if (signal?.aborted) {
          return;
        }

        resolve(data);
      }, 0);
    });
  });

const mockSubcategories: Subcategory[] = [];
const mockSkill: SkillCategory = {
  id: 1,
  title: 'Programming',
  slug: 'education',
  icon: 'code',
  subcategories: mockSubcategories,
};

const mockCity: City = {
  id: 1,
  name: 'Moscow',
};

const mockUser: UserDb = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
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
    jest.clearAllMocks();
  });

  it('загружает данные при монтировании, если их нет', async () => {
    const store = createTestStore();

    mockedGetUsers.mockResolvedValue([mockUser]);
    mockedGetCities.mockResolvedValue([mockCity]);
    mockedGetSkills.mockResolvedValue([mockSkill]);

    const { unmount } = renderHook(() => useLoadCatalogData(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(store.getState().catalog.users).toEqual([mockUser]);
      expect(store.getState().catalog.cities).toEqual([mockCity]);
      expect(store.getState().catalog.skills).toEqual([mockSkill]);
      expect(store.getState().catalog.loading).toBe(false);
    });

    expect(mockedGetUsers).toHaveBeenCalledTimes(1);
    expect(mockedGetCities).toHaveBeenCalledTimes(1);
    expect(mockedGetSkills).toHaveBeenCalledTimes(1);

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
      expect(mockedGetUsers).not.toHaveBeenCalled();
      expect(mockedGetCities).not.toHaveBeenCalled();
      expect(mockedGetSkills).not.toHaveBeenCalled();
    });

    unmount();
  });

  it('устанавливает ошибку при сбое', async () => {
    const store = createTestStore();

    mockedGetUsers.mockRejectedValue(new Error('Network error'));
    mockedGetCities.mockResolvedValue([mockCity]);
    mockedGetSkills.mockResolvedValue([mockSkill]);

    const { unmount } = renderHook(() => useLoadCatalogData(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(store.getState().catalog.error).toBe('Network error');
      expect(store.getState().catalog.loading).toBe(false);
    });

    unmount();
  });

  it('не зависает в загрузке при повторном монтировании в StrictMode', async () => {
    const store = createTestStore();

    mockedGetUsers.mockImplementation(createAbortAwareMock([mockUser]));
    mockedGetCities.mockImplementation(createAbortAwareMock([mockCity]));
    mockedGetSkills.mockImplementation(createAbortAwareMock([mockSkill]));

    const { unmount } = renderHook(() => useLoadCatalogData(), {
      wrapper: ({ children }) => (
        <StrictMode>
          <Provider store={store}>{children}</Provider>
        </StrictMode>
      ),
    });

    await waitFor(() => {
      expect(store.getState().catalog.loading).toBe(false);
      expect(store.getState().catalog.users).toEqual([mockUser]);
      expect(store.getState().catalog.cities).toEqual([mockCity]);
      expect(store.getState().catalog.skills).toEqual([mockSkill]);
    });

    unmount();
  });
});
