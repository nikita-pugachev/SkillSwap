import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard, UserCardProps, UserSkill } from './UserCard';

// Моки для UI-компонентов
jest.mock('@/components/ui/Avatar', () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}));

jest.mock('@/components/ui/IconButton', () => ({
  IconButton: ({ ariaLabel, onClick }: { ariaLabel: string; onClick: () => void }) => (
    <button aria-label={ariaLabel} onClick={onClick} data-testid="icon-button">
      icon
    </button>
  ),
}));

jest.mock('@/components/ui/SkillTag', () => ({
  SkillTag: ({ label, count, category }: { label?: string; count?: number; category?: string }) => (
    <div data-testid="skill-tag" data-category={category}>
      {label} {count ? `+${count}` : ''}
    </div>
  ),
}));

jest.mock('@/components/ui/ButtonUI', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// Тестовые данные
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
  isFavorite: false,
  onFavoriteToggle: jest.fn(),
  onDetailsClick: jest.fn(),
};

describe('UserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user name and location with age', () => {
    render(<UserCard {...mockProps} />);
    expect(screen.getByText('Иван Петров')).toBeInTheDocument();
    expect(screen.getByText(/Москва, \d+ (год|года|лет)/)).toBeInTheDocument();
  });

  it('displays correct age', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 15)); // 15 марта 2026

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

  it('calls onFavoriteToggle when favorite button clicked', () => {
    render(<UserCard {...mockProps} />);
    const favButton = screen.getByRole('button', { name: /добавить в избранное/i });
    fireEvent.click(favButton);
    expect(mockProps.onFavoriteToggle).toHaveBeenCalledWith(1);
  });

  it('calls onDetailsClick when details button clicked', () => {
    render(<UserCard {...mockProps} />);
    const detailsButton = screen.getByRole('button', { name: /подробнее/i });
    fireEvent.click(detailsButton);
    expect(mockProps.onDetailsClick).toHaveBeenCalledWith(1);
  });

  it('displays filled favorite icon when isFavorite true', () => {
    render(<UserCard {...mockProps} isFavorite={true} />);
    const favButton = screen.getByRole('button', { name: /удалить из избранного/i });
    expect(favButton).toBeInTheDocument();
  });
});
