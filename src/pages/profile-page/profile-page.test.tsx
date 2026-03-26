import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ProfilePage from './ProfilePage';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { userEdit } from '@/services/slices/authSlice';
import * as api from '@/utils/api';

jest.mock('@/services/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/utils/api', () => ({
  getUsersFromDb: jest.fn(),
  getSkills: jest.fn(),
}));

jest.mock('@/components/ui', () => ({
  Button: ({
    children,
    type = 'button',
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) => (
    <button type={type} {...props}>
      {children}
    </button>
  ),
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
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

type MockState = {
  auth: {
    user: {
      id: number;
      name: string;
      userAvatar: string;
      email?: string;
      password?: string;
      cityId?: number;
      gender?: 'Мужской' | 'Женский' | 'Не указан';
      birthday?: string;
      about?: string;
    } | null;
    isAuthenticated: boolean;
  };
  favorites: {
    favoriteIds: number[];
  };
  profileSkills: {
    items: Array<{
      userId: number;
      teachSkillId: number;
      title: string;
      subcategoryId: number;
      categoryTitle: string;
      subcategoryTitle: string;
    }>;
    loaded: boolean;
  };
  requests: {
    requests: Array<{
      id: string;
      skillId: string;
      fromUserId: string;
      toUserId: string;
      status: 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';
      createdAt: string;
    }>;
  };
  skills: {
    items: [];
    searchQuery: string;
    selectedCategory: string;
  };
};

describe('ProfilePage', () => {
  const mockDispatch = jest.fn();
  const mockGetUsersFromDb = api.getUsersFromDb as jest.MockedFunction<typeof api.getUsersFromDb>;
  const mockGetSkills = api.getSkills as jest.MockedFunction<typeof api.getSkills>;
  const fullUser = {
    id: 1,
    name: 'Иван',
    userAvatar: '/src/assets/user-avatars/ivan.png',
    email: 'ivan92@gmail.com',
    password: '748291',
    cityId: 2,
    gender: 'Мужской' as const,
    birthday: '1992-03-29',
    about: 'Люблю ритм, кофе по утрам и новые знакомства.',
  };

  let mockState: MockState;

  const bindSelectors = () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation(
      (selector: (state: MockState) => unknown) => selector(mockState)
    );
  };

  const renderPage = async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  };

  beforeEach(() => {
    mockState = {
      auth: {
        user: fullUser,
        isAuthenticated: true,
      },
      favorites: {
        favoriteIds: [],
      },
      profileSkills: {
        items: [],
        loaded: true,
      },
      requests: {
        requests: [],
      },
      skills: {
        items: [],
        searchQuery: '',
        selectedCategory: '',
      },
    };

    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    bindSelectors();
    mockDispatch.mockClear();
    mockGetUsersFromDb.mockResolvedValue([]);
    mockGetSkills.mockResolvedValue([]);

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

      if (url === '/db/users.json') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            users: [
              {
                id: 1,
                name: 'Иван',
                email: 'ivan92@gmail.com',
                password: '748291',
                userAvatar: '/src/assets/user-avatars/ivan.png',
                cityId: 2,
                gender: 'male',
                birthday: '1992-03-29',
                about: 'Люблю ритм, кофе по утрам и новые знакомства.',
                skillsTeach: [],
                skillsLearn: [],
                likes: 0,
                createdAt: '2026-01-01',
              },
            ],
          }),
        });
      }

      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fills profile fields from authenticated user data', async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByLabelText('Почта')).toHaveValue('ivan92@gmail.com');
      expect(screen.getByLabelText('Пароль')).toHaveValue('748291');
      expect(screen.getByLabelText('Имя')).toHaveValue('Иван');
      expect(screen.getByLabelText('Дата рождения')).toHaveValue('1992-03-29');
      expect(screen.getByLabelText('Пол')).toHaveValue('Мужской');
      expect(screen.getByLabelText('Город')).toHaveValue('Санкт-Петербург');
      expect(screen.getByLabelText('О себе')).toHaveValue(
        'Люблю ритм, кофе по утрам и новые знакомства.'
      );
    });

    expect(screen.getByTestId('avatar')).toHaveTextContent('Иван');
  });

  it('renders profile navigation and save button', async () => {
    await renderPage();

    expect(screen.getByText('Заявки')).toBeInTheDocument();
    expect(screen.getByText('Мои обмены')).toBeInTheDocument();
    expect(screen.getByText('Избранное')).toBeInTheDocument();
    expect(screen.getByText('Мои навыки')).toBeInTheDocument();
    expect(screen.getByText('Личные данные')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    await renderPage();

    const passwordInput = screen.getByLabelText('Пароль');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Скрыть пароль' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('hydrates stale authenticated user data by id', async () => {
    mockState = {
      ...mockState,
      auth: {
        user: {
          id: 1,
          name: 'Иван',
          userAvatar: '/src/assets/user-avatars/ivan.png',
        },
        isAuthenticated: true,
      },
    };
    bindSelectors();

    await renderPage();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/db/users.json');
      expect(mockDispatch).toHaveBeenCalledWith(
        userEdit({
          id: 1,
          name: 'Иван',
          userAvatar: '/src/assets/user-avatars/ivan.png',
          email: 'ivan92@gmail.com',
          password: '748291',
          city: undefined,
          cityId: 2,
          gender: 'Мужской',
          birthday: '1992-03-29',
          about: 'Люблю ритм, кофе по утрам и новые знакомства.',
        })
      );
    });
  });
});
