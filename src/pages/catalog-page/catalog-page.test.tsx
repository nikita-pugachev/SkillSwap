import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Layout from '@/components/layout/layout';
import authReducer from '@/services/slices/authSlice';
import catalogReducer from '@/services/slices/catalogSlice';
import favoritesReducer from '@/services/slices/favoritesSlice';
import requestsReducer from '@/services/slices/requestsSlice';
import skillsReducer from '@/services/slices/skillsSlice';
import { getCities, getSkills, getUsers } from '@/utils/api';
import type { City, SkillCategory, UserDb } from '@/utils/types';

import CatalogPage from './catalog-page';

jest.mock('@/utils/api', () => ({
  getSkills: jest.fn(),
  getCities: jest.fn(),
  getUsers: jest.fn(),
}));

jest.mock('@/components/widgets/Header', () => ({
  Header: ({ onSearch }: { onSearch?: (value: string) => void }) => (
    <div>
      <button type="button" onClick={() => onSearch?.('Английский')}>
        Search English
      </button>
      <button type="button" onClick={() => onSearch?.('')}>
        Clear Search
      </button>
    </div>
  ),
}));

jest.mock('@/components/widgets/Footer', () => ({
  Footer: () => <div data-testid="footer" />,
}));

jest.mock('@/components/FilterSidebar', () => ({
  FilterSidebar: ({
    activeFiltersCount,
    onChange,
    onReset,
  }: {
    activeFiltersCount: number;
    onChange: (filters: { city?: string[] }) => void;
    onReset: () => void;
  }) => (
    <div>
      <span data-testid="active-filters-count">{activeFiltersCount}</span>
      <button type="button" onClick={() => onChange({ city: ['Москва'] })}>
        Filter Moscow
      </button>
      <button type="button" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  ),
}));

jest.mock('@/components/ui', () => ({
  Button: ({
    children,
    type = 'button',
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type={type} {...props}>
      {children}
    </button>
  ),
  CardSection: ({
    title,
    cards,
    buttonText,
    onActionClick,
  }: {
    title?: string;
    cards: Array<{ id: number; name: string }>;
    buttonText?: string;
    onActionClick?: () => void;
  }) => (
    <section data-testid={title ? `card-section-${title}` : 'card-section-results'}>
      {title ? <h2>{title}</h2> : null}

      <ol>
        {cards.map((card) => (
          <li key={card.id}>{card.name}</li>
        ))}
      </ol>

      {buttonText && onActionClick ? (
        <button type="button" aria-label={`${buttonText} ${title}`} onClick={onActionClick}>
          {buttonText}
        </button>
      ) : null}
    </section>
  ),
}));

const mockedGetSkills = getSkills as jest.MockedFunction<typeof getSkills>;
const mockedGetCities = getCities as jest.MockedFunction<typeof getCities>;
const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

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

const cities: City[] = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Казань' },
];

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
  {
    id: 4,
    name: 'Глеб',
    userAvatar: '/gleb.png',
    cityId: 2,
    gender: 'Мужской',
    birthday: '1995-09-09',
    about: 'Учусь новому',
    skillsTeach: [
      {
        id: 4,
        customTitle: 'Скетчинг',
        subcategoryId: 20,
        description: 'Быстрые зарисовки',
        images: [],
      },
    ],
    skillsLearn: [10],
    likes: 1,
    createdAt: '2024-05-01',
  },
];

const createTestStore = () =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
      catalog: catalogReducer,
      auth: authReducer,
      skills: skillsReducer,
      requests: requestsReducer,
    },
  });

const renderPage = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout variant="main" withFooter />}>
            <Route path="/" element={<CatalogPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );

const getCardNames = (sectionTestId: string) =>
  within(screen.getByTestId(sectionTestId))
    .getAllByRole('listitem')
    .map((item) => item.textContent);

describe('CatalogPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    mockedGetSkills.mockResolvedValue(skills);
    mockedGetCities.mockResolvedValue(cities);
    mockedGetUsers.mockResolvedValue(users);
  });

  it('renders guest home sections after loading data', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Новое' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Рекомендуем' })).toBeInTheDocument();
    expect(screen.queryByTestId('card-section-results')).not.toBeInTheDocument();
  });

  it('builds the exact-match section from the authenticated user learning skills', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userId', '1');

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Точное совпадение' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Новые идеи' })).toBeInTheDocument();
    expect(getCardNames('card-section-Точное совпадение')).toEqual(['Борис']);

    await user.click(screen.getByRole('button', { name: 'Смотреть все Точное совпадение' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(': 1');
    expect(getCardNames('card-section-results')).toEqual(['Борис']);
  });

  it('shows the "Новые идеи" heading for the authenticated new collection', async () => {
    const user = userEvent.setup();

    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userId', '1');

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Новые идеи' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Смотреть все Новые идеи' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Новые идеи: 4');
    expect(getCardNames('card-section-results')).toEqual(['Глеб', 'Борис', 'Анна', 'Вера']);
  });

  it('combines the layout search query with sidebar filters', async () => {
    const user = userEvent.setup();

    renderPage();
    await screen.findByRole('heading', { name: 'Популярное' });

    await user.click(screen.getByRole('button', { name: 'Search English' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(': 3');
    expect(getCardNames('card-section-results')).toEqual(['Глеб', 'Борис', 'Анна']);

    await user.click(screen.getByRole('button', { name: 'Filter Moscow' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(': 1');
    expect(getCardNames('card-section-results')).toEqual(['Анна']);
  });

  it('clears the search query when the search chip is clicked', async () => {
    const user = userEvent.setup();

    renderPage();
    await screen.findByRole('heading', { name: 'Популярное' });

    await user.click(screen.getByRole('button', { name: 'Search English' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(': 3');

    await user.click(screen.getByRole('button', { name: 'Английский' }));

    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument();
    expect(screen.queryByTestId('card-section-results')).not.toBeInTheDocument();
  });

  it('resets filters and clears the shared search query', async () => {
    const user = userEvent.setup();

    renderPage();
    await screen.findByRole('heading', { name: 'Популярное' });

    await user.click(screen.getByRole('button', { name: 'Search English' }));
    await user.click(screen.getByRole('button', { name: 'Filter Moscow' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(': 1');
    expect(screen.getByTestId('active-filters-count')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'Reset Filters' }));

    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument();
    expect(screen.queryByTestId('card-section-results')).not.toBeInTheDocument();
    expect(screen.getByTestId('active-filters-count')).toHaveTextContent('0');
  });
  it('restores persisted filters after remounting the page', async () => {
    const user = userEvent.setup();

    const firstRender = renderPage();
    await screen.findByRole('heading', { name: 'Популярное' });

    await user.click(screen.getByRole('button', { name: 'Search English' }));
    await user.click(screen.getByRole('button', { name: 'Filter Moscow' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(': 1');
    expect(getCardNames('card-section-results')).toEqual(['Анна']);

    firstRender.unmount();

    renderPage();

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(': 1');
    expect(screen.getByTestId('active-filters-count')).toHaveTextContent('1');
    expect(getCardNames('card-section-results')).toEqual(['Анна']);
  });
});
