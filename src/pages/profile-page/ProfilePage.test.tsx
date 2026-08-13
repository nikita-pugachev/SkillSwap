import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import authReducer, { login } from '@/services/slices/authSlice';
import favoritesReducer from '@/services/slices/favoritesSlice';
import profileSkillsReducer from '@/services/slices/profileSkillsSlice';
import requestsReducer from '@/services/slices/requestsSlice';
import skillsReducer from '@/services/slices/skillsSlice';
import type { SkillCategory, UserFromDb } from '@/utils/types';
import * as api from '@/utils/api';

jest.mock('@/components/ui', () => ({
  Button: ({
    children,
    onClick,
    type = 'button',
    ...rest
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    variant?: string;
    'aria-selected'?: boolean;
  }) => (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar" aria-label={name} />,
  InputBaseContainerUI: ({
    label,
    id,
    children,
  }: {
    label: string;
    id: string;
    children: ReactNode;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  ),
  InputUI: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  IconButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick?: () => void }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick}>
      icon
    </button>
  ),
}));

jest.mock('@/components/DateInput', () => ({
  DateInput: ({
    id,
    label,
    defaultValue,
    onChange,
  }: {
    id: string;
    label: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
  }) => (
    <input
      id={id}
      aria-label={label}
      defaultValue={defaultValue}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
}));

jest.mock('@/components/SelectInput/SelectInput', () => ({
  SelectInput: ({
    id,
    label,
    defaultValue,
    onChange,
    options = [],
  }: {
    id: string;
    label: string;
    defaultValue?: string;
    onChange?: (option: { id: number; name: string } | null) => void;
    options?: Array<{ id: number; name: string }>;
  }) => (
    <input
      id={id}
      aria-label={label}
      value={defaultValue ?? ''}
      readOnly
      onClick={() => onChange?.(options[0] ?? null)}
    />
  ),
}));

jest.mock('@/utils/api', () => ({
  getUsersFromDb: jest.fn(),
  getSkills: jest.fn(),
}));

import ProfilePage from './ProfilePage';

const STORAGE_KEY = 'skillswap_requests';
const mockGetUsersFromDb = api.getUsersFromDb as jest.MockedFunction<typeof api.getUsersFromDb>;
const mockGetSkills = api.getSkills as jest.MockedFunction<typeof api.getSkills>;

const mockUserAnna: UserFromDb = {
  id: 2,
  name: 'Анна',
  email: 'anna@example.com',
  password: '123456',
  userAvatar: '/src/assets/user-avatars/anna.png',
  cityId: 1,
  gender: 'female',
  birthday: '',
  about: '',
  skillsTeach: [],
  skillsLearn: [],
  likes: 0,
  createdAt: '',
};

const mockUserIvanWithSkill: UserFromDb = {
  id: 1,
  name: 'Иван',
  email: 'ivan@example.com',
  password: '123456',
  userAvatar: '/src/assets/user-avatars/ivan.png',
  cityId: 1,
  gender: 'male',
  birthday: '',
  about: '',
  skillsTeach: [
    {
      id: 1001,
      customTitle: 'Игра на барабанах',
      subcategoryId: 404,
      description: '',
      images: [],
    },
  ],
  skillsLearn: [],
  likes: 0,
  createdAt: '',
};

const mockSkillsCatalog: SkillCategory[] = [
  {
    id: 4,
    title: 'Творчество и искусство',
    slug: 'art',
    icon: '',
    subcategories: [{ id: 404, title: 'Музыка и звук' }],
  },
];

function createStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      favorites: favoritesReducer,
      profileSkills: profileSkillsReducer,
      requests: requestsReducer,
      skills: skillsReducer,
    },
  });
}

function renderPage(initialPath = '/profile/personal') {
  const store = createStore();

  store.dispatch(
    login({
      id: 1,
      name: 'Иван',
      userAvatar: '/src/assets/user-avatars/ivan.png',
      email: 'ivan@example.com',
    })
  );

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:tab" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return store;
}

describe('ProfilePage requests tab', () => {
  beforeEach(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'req-1',
          skillId: 'Английский язык',
          fromUserId: '2',
          toUserId: '1',
          status: 'pending',
          createdAt: '2026-03-20T10:00:00.000Z',
        },
        {
          id: 'req-2',
          skillId: 'Йога для спины после работы',
          fromUserId: '1',
          toUserId: '2',
          status: 'pending',
          createdAt: '2026-03-21T10:00:00.000Z',
        },
      ])
    );

    mockGetUsersFromDb.mockResolvedValue([mockUserAnna]);
    mockGetSkills.mockResolvedValue(mockSkillsCatalog);

    globalThis.fetch = jest.fn((input: string | URL) => {
      const url = String(input);

      if (url === '/db/cities.json') {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, name: 'Москва' },
            { id: 2, name: 'Санкт-Петербург' },
          ],
        });
      }

      if (url === '/db/gender.json') {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, name: 'Не указан' },
            { id: 2, name: 'Мужской' },
            { id: 3, name: 'Женский' },
          ],
        });
      }

      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem(STORAGE_KEY);
  });

  it('accepts inbox request from the store', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Заявки/i }));

    await waitFor(() => {
      expect(screen.getByText('Английский язык')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Принять' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Принять' })).not.toBeInTheDocument();
      expect(screen.getByText('Принята')).toBeInTheDocument();
    });
  });

  it('switches to outbox and shows the recipient card', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Заявки/i }));

    await waitFor(() => {
      expect(screen.getByText('Английский язык')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('tab', { name: 'Исходящие' }));

    await waitFor(() => {
      expect(screen.getByText('Йога для спины после работы')).toBeInTheDocument();
      expect(screen.getByText('Анна')).toBeInTheDocument();
    });

    expect(screen.queryByText('Английский язык')).not.toBeInTheDocument();
  });
});

describe('ProfilePage skills tab', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    mockGetSkills.mockResolvedValue(mockSkillsCatalog);
    mockGetUsersFromDb.mockResolvedValue([mockUserIvanWithSkill, mockUserAnna]);

    globalThis.fetch = jest.fn((input: string | URL) => {
      const url = String(input);

      if (url === '/db/cities.json') {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, name: 'Москва' },
            { id: 2, name: 'Санкт-Петербург' },
          ],
        });
      }

      if (url === '/db/gender.json') {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, name: 'Не указан' },
            { id: 2, name: 'Мужской' },
            { id: 3, name: 'Женский' },
          ],
        });
      }

      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem(STORAGE_KEY);
  });

  it('shows user skills and removes one from the list', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Мои навыки/i }));

    await waitFor(() => {
      expect(screen.getByText('Игра на барабанах')).toBeInTheDocument();
      expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(screen.queryByText('Игра на барабанах')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: '+ Добавить навык' })).toHaveAttribute(
      'href',
      '/create'
    );
  });

  it('shows the empty state link when the user has no skills', async () => {
    mockGetUsersFromDb.mockResolvedValue([
      {
        ...mockUserIvanWithSkill,
        skillsTeach: [],
      },
    ]);

    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Мои навыки/i }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '+ Добавить навык' })).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: '+ Добавить навык' })).toHaveAttribute(
      'href',
      '/create'
    );
  });
});
