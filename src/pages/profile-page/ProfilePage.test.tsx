import type { ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer, { login } from '@/services/slices/authSlice';
import favoritesReducer from '@/services/slices/favoritesSlice';
import requestsReducer from '@/services/slices/requestsSlice';
import skillsReducer from '@/services/slices/skillsSlice';
import type { Skill } from '@/utils/types';
import * as api from '@/utils/api';

jest.mock('@/components/ui', () => ({
  Button: ({
    children,
    onClick,
    type = 'button',
    ...rest
  }: {
    children?: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: string;
    role?: string;
    'aria-selected'?: boolean;
  } & Record<string, unknown>) => (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar" aria-label={name} />,
}));

import ProfilePage from './ProfilePage';

jest.mock('@/components/Footer/Footer', () => ({
  Footer: () => null,
}));

const mockUserAnna = {
  id: 2,
  name: 'Анна',
  userAvatar: '/src/assets/user-avatars/anna.png',
  cityId: 1,
  gender: 'female',
  birthday: '',
  about: '',
  skillsTeach: [] as {
    id: number;
    customTitle: string;
    subcategoryId: number;
    description: string;
    images: string[];
  }[],
  skillsLearn: [] as number[],
  likes: 0,
  createdAt: '',
};

const mockSkillsCatalog: Skill[] = [
  {
    id: 4,
    title: 'Творчество и искусство',
    slug: 'art',
    icon: '',
    subcategories: [{ id: 404, title: 'Музыка и звук' }],
  },
];

jest.mock('@/utils/api', () => ({
  getRequests: jest.fn(),
  getUsersFromDb: jest.fn(),
  getSkills: jest.fn(),
}));

const mockGetRequests = api.getRequests as jest.MockedFunction<typeof api.getRequests>;
const mockGetUsersFromDb = api.getUsersFromDb as jest.MockedFunction<typeof api.getUsersFromDb>;
const mockGetSkills = api.getSkills as jest.MockedFunction<typeof api.getSkills>;

function createStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      favorites: favoritesReducer,
      requests: requestsReducer,
      skills: skillsReducer,
    },
  });
}

describe('ProfilePage requests tab', () => {
  beforeEach(() => {
    mockGetRequests.mockResolvedValue([
      {
        id: 'req-1',
        fromUserId: 2,
        toUserId: 1,
        status: 'pending',
        customTitle: 'Английский язык',
      },
      {
        id: 'req-2',
        fromUserId: 1,
        toUserId: 2,
        status: 'pending',
        customTitle: 'Йога для спины после работы',
        categoryTitle: 'Здоровье и лайфстайл',
      },
    ]);
    mockGetUsersFromDb.mockResolvedValue([mockUserAnna]);
    mockGetSkills.mockResolvedValue(mockSkillsCatalog);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads requests from API and accepts inbox item', async () => {
    const store = createStore();
    store.dispatch(login({ id: 1, name: 'Иван', userAvatar: '/src/assets/user-avatars/ivan.png' }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole('button', { name: /Заявки/i }));

    await waitFor(() => {
      expect(mockGetRequests).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Английский язык')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Принять' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Принять' })).not.toBeInTheDocument();
      expect(screen.getByText('Принята')).toBeInTheDocument();
    });
  });

  it('переключает таб на исходящие и показывает карточку адресата', async () => {
    const store = createStore();
    store.dispatch(login({ id: 1, name: 'Иван', userAvatar: '/src/assets/user-avatars/ivan.png' }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    );

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

const mockUserIvanWithSkill = {
  id: 1,
  name: 'Иван',
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
      images: [] as string[],
    },
  ],
  skillsLearn: [] as number[],
  likes: 0,
  createdAt: '',
};

describe('ProfilePage skills tab', () => {
  beforeEach(() => {
    mockGetRequests.mockResolvedValue([]);
    mockGetSkills.mockResolvedValue(mockSkillsCatalog);
    mockGetUsersFromDb.mockResolvedValue([mockUserIvanWithSkill, mockUserAnna]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('показывает навыки пользователя и удаляет из списка', async () => {
    const store = createStore();
    store.dispatch(login({ id: 1, name: 'Иван', userAvatar: '/src/assets/user-avatars/ivan.png' }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    );

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

  it('пустое состояние: ссылка на создание навыка', async () => {
    mockGetUsersFromDb.mockResolvedValue([
      {
        ...mockUserIvanWithSkill,
        skillsTeach: [],
      },
    ]);

    const store = createStore();
    store.dispatch(login({ id: 1, name: 'Иван', userAvatar: '/src/assets/user-avatars/ivan.png' }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    );

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
