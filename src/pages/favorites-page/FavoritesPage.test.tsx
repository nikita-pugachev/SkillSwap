/* global global */
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { FavoritesPage } from './FavoritesPage';
import favoritesReducer from '@/services/slices/favoritesSlice';

const mockCities = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
];

const mockSkills = [
  {
    id: 1,
    title: 'Бизнес и карьера',
    slug: 'business',
    icon: 'business.svg',
    subcategories: [
      { id: 106, title: 'Тайм-менеджмент' },
      { id: 102, title: 'Маркетинг' },
    ],
  },
  {
    id: 2,
    title: 'Иностранные языки',
    slug: 'languages',
    icon: 'languages.svg',
    subcategories: [{ id: 201, title: 'Английский' }],
  },
];

const mockUsers = {
  users: [
    {
      id: 1,
      name: 'Иван',
      userAvatar: '/avatar1.png',
      cityId: 1,
      gender: 'male',
      birthday: '1992-03-29',
      about: 'О себе',
      skillsTeach: [
        {
          id: 1001,
          customTitle: 'Игра на барабанах',
          subcategoryId: 404,
          description: 'Описание',
          images: [],
        },
      ],
      skillsLearn: [106, 201],
      likes: 50,
      createdAt: '2026-01-01',
    },
    {
      id: 2,
      name: 'Анна',
      userAvatar: '/avatar2.png',
      cityId: 2,
      gender: 'female',
      birthday: '2000-07-15',
      about: 'О себе',
      skillsTeach: [],
      skillsLearn: [102],
      likes: 42,
      createdAt: '2026-01-05',
    },
  ],
};

global.fetch = jest.fn();

const createMockStore = (favoriteIds: number[] = []) => {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: {
      favorites: {
        favoriteIds,
      },
    },
  });
};

describe('FavoritesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен показывать текст "У вас пока нет избранных пользователей", когда список пуст', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <BrowserRouter>
            <FavoritesPage />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('У вас пока нет избранных пользователей')).toBeInTheDocument();
      });
    });

    it('должен показывать карточки избранных пользователей', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      const store = createMockStore([1]);

      render(
        <Provider store={store}>
          <BrowserRouter>
            <FavoritesPage />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('Иван')).toBeInTheDocument();
        expect(screen.queryByText('Анна')).not.toBeInTheDocument();
      });
    });

    it('должен показывать несколько карточек при нескольких избранных', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      const store = createMockStore([1, 2]);

      render(
        <Provider store={store}>
          <BrowserRouter>
            <FavoritesPage />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('Иван')).toBeInTheDocument();
        expect(screen.getByText('Анна')).toBeInTheDocument();
      });
    });
  });

  describe('Обработка ошибок', () => {
    it('должен показывать ошибку при неудачной загрузке пользователей', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: false, status: 500 });

      const store = createMockStore([1]);

      render(
        <Provider store={store}>
          <BrowserRouter>
            <FavoritesPage />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Ошибка загрузки пользователей/i)).toBeInTheDocument();
      });
    });

    it('должен показывать ошибку при неудачной загрузке городов (но не падать)', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      const store = createMockStore([1]);

      render(
        <Provider store={store}>
          <BrowserRouter>
            <FavoritesPage />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('Иван')).toBeInTheDocument();

        const locationElement = screen.getByText((content, element) => {
          return element?.className === 'location' && content.includes('Город не указан');
        });
        expect(locationElement).toBeInTheDocument();
      });
    });
  });

  describe('Преобразование данных', () => {
    it('должен корректно преобразовывать cityId в название города', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      const store = createMockStore([1]);

      render(
        <Provider store={store}>
          <BrowserRouter>
            <FavoritesPage />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        const locationElement = screen.getByText((content, element) => {
          return element?.className === 'location' && content.includes('Москва');
        });
        expect(locationElement).toBeInTheDocument();
      });
    });
  });
});
