import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard, UserCardProps, UserSkill } from './UserCard';
import { toggleFavorite } from '@/services/slices/favoritesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsFavorite } from '@/services/selectors';
import { RootState } from '@/services/store';

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
jest.mock('@/components/ui', () => ({
  Avatar: () => <div data-testid="avatar" />,
  IconButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick: () => void }) => (
    <button aria-label={ariaLabel} onClick={onClick} data-testid="icon-button">
      icon
    </button>
  ),
  SkillTag: ({ label, count, category }: { label?: string; count?: number; category?: string }) => (
    <div data-testid="skill-tag" data-category={category}>
      {label} {count ? `+${count}` : ''}
    </div>
  ),
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// --- test data ---
const mockTeachSkills: UserSkill[] = [
  { name: 'React', category: 'education' },
  { name: 'TypeScript', category: 'education' },
  { name: 'Node.js', category: 'other' },
];

const mockLearnSkills: UserSkill[] = [
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
};

describe('UserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseDispatch.mockReturnValue(mockDispatch);

    const mockState: RootState = {
      favorites: {
        favoriteIds: [],
      },
    } as RootState;

    mockedUseSelector.mockImplementation((selector: (state: RootState) => unknown) =>
      selector(mockState)
    );

    mockSelectIsFavorite.mockReturnValue(() => false);
  });

  it('renders user name and location with age', () => {
    render(<UserCard {...mockProps} />);
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText(/Москва, \d+ (год|года|лет)/)).toBeInTheDocument();
  });

  it('displays correct age', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 15));

    render(<UserCard {...mockProps} />);
    expect(screen.getByText(/Москва, 35 лет/)).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('shows correct skill tags with categories', () => {
    render(<UserCard {...mockProps} />);
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
    render(<UserCard {...mockProps} />);
    const favButton = screen.getByRole('button', {
      name: /добавить в избранное/i,
    });

    fireEvent.click(favButton);

    expect(mockDispatch).toHaveBeenCalledWith(toggleFavorite(1));
  });

  it('calls onDetailsClick when details button clicked', () => {
    render(<UserCard {...mockProps} />);
    const detailsButton = screen.getByRole('button', { name: /подробнее/i });

    fireEvent.click(detailsButton);

    expect(mockProps.onDetailsClick).toHaveBeenCalledWith(1);
  });

  it('displays filled favorite icon when user is favorite', () => {
    mockSelectIsFavorite.mockReturnValue(() => true);

    render(<UserCard {...mockProps} />);

    const favButton = screen.getByRole('button', {
      name: /удалить из избранного/i,
    });

    expect(favButton).toBeInTheDocument();
  });
});
