import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard, UserCardProps } from './UserCard';
import { toggleFavorite } from '@/services/slices/favoritesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsFavorite } from '@/services/selectors';
import { RootState } from '@/services/store';
import { UserSkillTag } from '@/utils/types';

// --- mocks redux ---
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockedUseDispatch = useDispatch as unknown as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;

// --- mock selector ---
jest.mock('@/services/selectors', () => ({
  selectIsFavorite: jest.fn(),
}));

const mockSelectIsFavorite = selectIsFavorite as unknown as jest.Mock;

// --- UI mocks ---
jest.mock('../Avatar', () => ({
  Avatar: () => <div data-testid="avatar" />,
}));

jest.mock('../IconButton', () => ({
  IconButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick: () => void }) => (
    <button aria-label={ariaLabel} onClick={onClick} data-testid="icon-button">
      icon
    </button>
  ),
}));

jest.mock('../SkillTag', () => ({
  SkillTag: ({ label, count, category }: { label?: string; count?: number; category?: string }) => (
    <div data-testid="skill-tag" data-category={category}>
      {label} {count ? `+${count}` : ''}
    </div>
  ),
}));

jest.mock('../Button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// --- test data ---
const mockTeachSkills: UserSkillTag[] = [
  { name: 'React', category: 'education' },
  { name: 'TypeScript', category: 'education' },
  { name: 'Node.js', category: 'other' },
];

const mockLearnSkills: UserSkillTag[] = [
  { name: 'Python', category: 'languages' },
  { name: 'Django', category: 'business' },
];

const mockProps: UserCardProps = {
  id: 1,
  name: 'Иван Петров',
  avatar: 'https://example.com/avatar.jpg',
  city: 'Москва',
  birthday: '1990-05-15',
  skillsTeach: mockTeachSkills,
  skillsLearn: mockLearnSkills,
  onDetailsClick: jest.fn(),
  likes: 0,
  isLogin: true,
};

describe('UserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseDispatch.mockReturnValue(mockDispatch);

    const mockState: RootState = {
      favorites: {
        favoriteIds: [],
      },
      catalog: {
        users: [],
        skills: [],
        cities: [],
        loading: false,
        error: null,
      },
      auth: {
        user: null,
        isAuthenticated: false,
      },
      skills: {
        items: [],
        searchQuery: '',
        selectedCategory: '',
      },
    };

    mockedUseSelector.mockImplementation((selector: (state: RootState) => unknown) =>
      selector(mockState)
    );

    mockSelectIsFavorite.mockReturnValue(() => false);
  });

  it('renders user name and location with age', () => {
    render(
      <MemoryRouter>
        <UserCard {...mockProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText(/Москва, \d+ (год|года|лет)/)).toBeInTheDocument();
  });

  it('displays correct age', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 15));

    render(
      <MemoryRouter>
        <UserCard {...mockProps} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Москва, 35 лет/)).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('shows correct skill tags with categories', () => {
    render(
      <MemoryRouter>
        <UserCard {...mockProps} />
      </MemoryRouter>
    );
    const tags = screen.getAllByTestId('skill-tag');

    expect(tags).toHaveLength(5);

    expect(tags[0]).toHaveTextContent('React');
    expect(tags[0]).toHaveAttribute('data-category', 'education');

    expect(tags[1]).toHaveTextContent('TypeScript');
    expect(tags[1]).toHaveAttribute('data-category', 'education');

    expect(tags[2]).toHaveTextContent('+1');
    expect(tags[2]).toHaveAttribute('data-category', 'other');

    expect(tags[3]).toHaveTextContent('Python');
    expect(tags[3]).toHaveAttribute('data-category', 'languages');

    expect(tags[4]).toHaveTextContent('Django');
    expect(tags[4]).toHaveAttribute('data-category', 'business');
  });

  it('dispatches toggleFavorite when favorite button clicked', () => {
    render(
      <MemoryRouter>
        <UserCard {...mockProps} />
      </MemoryRouter>
    );
    const favButton = screen.getByRole('button', {
      name: /добавить в избранное/i,
    });

    fireEvent.click(favButton);

    expect(mockDispatch).toHaveBeenCalledWith(toggleFavorite(1));
  });

  it('calls onDetailsClick when details button clicked', () => {
    render(
      <MemoryRouter>
        <UserCard {...mockProps} />
      </MemoryRouter>
    );
    const detailsButton = screen.getByRole('button', { name: /подробнее/i });

    fireEvent.click(detailsButton);

    expect(mockProps.onDetailsClick).toHaveBeenCalledWith(1);
  });

  it('displays filled favorite icon when user is favorite', () => {
    mockSelectIsFavorite.mockReturnValue(() => true);

    render(
      <MemoryRouter>
        <UserCard {...mockProps} />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', {
      name: /удалить из избранного/i,
    });

    expect(favButton).toBeInTheDocument();
  });

  it('does not dispatch toggleFavorite when user is not logged in', () => {
    render(
      <MemoryRouter>
        <UserCard {...mockProps} isLogin={false} />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', {
      name: /добавить в избранное/i,
    });

    fireEvent.click(favButton);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
