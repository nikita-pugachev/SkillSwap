import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard, UserCardProps } from './UserCard';

jest.mock('@/components/ui/SkillTag', () => ({
  SkillTag: ({ label, count }: { label?: string; count?: number }) => (
    <div data-testid="skill-tag">
      {label} {count ? `+${count}` : ''}
    </div>
  ),
}));

jest.mock('@/components/ui/ButtonUI', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick} data-testid="button">
      {children}
    </button>
  ),
}));

const mockProps: UserCardProps = {
  id: 1,
  name: 'Иван Петров',
  avatar: 'https://example.com/avatar.jpg',
  city: 'Москва',
  birthday: '1990-05-15',
  skillsTeach: ['React', 'TypeScript', 'Node.js'],
  skillsLearn: ['Python', 'Django'],
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
    expect(screen.getByText(/Москва, \d+ лет/)).toBeInTheDocument();
  });

  it('displays correct age', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 15)); // 15 марта 2026

    render(<UserCard {...mockProps} />);
    expect(screen.getByText(/Москва, 35 лет/)).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('shows correct skill tags (max 2 + counter)', () => {
    render(<UserCard {...mockProps} />);
    const tags = screen.getAllByTestId('skill-tag');
    expect(tags).toHaveLength(5);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Django')).toBeInTheDocument();
  });

  it('calls onFavoriteToggle when favorite button clicked', () => {
    render(<UserCard {...mockProps} />);
    const favButton = screen.getByRole('button', { name: /добавить в избранное/i });
    fireEvent.click(favButton);
    expect(mockProps.onFavoriteToggle).toHaveBeenCalledWith(1);
  });

  it('calls onDetailsClick when details button clicked', () => {
    render(<UserCard {...mockProps} />);
    const detailsButton = screen.getByTestId('button');
    fireEvent.click(detailsButton);
    expect(mockProps.onDetailsClick).toHaveBeenCalledWith(1);
  });

  it('displays filled favorite icon when isFavorite true', () => {
    render(<UserCard {...mockProps} isFavorite={true} />);
    const favButton = screen.getByRole('button', { name: /удалить из избранного/i });
    expect(favButton).toBeInTheDocument();
  });
});
