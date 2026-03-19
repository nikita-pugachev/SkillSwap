import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillCard, SkillCardProps } from './SkillCard';
import { SkillCategorySlug } from '@/utils/types';

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
}));

jest.mock('../user-card', () => ({
  UserCard: () => <div data-testid="user-card">User Card Component</div>,
}));

const mockProps: SkillCardProps = {
  id: 'skill-123',
  title: 'Разработка на React',
  category: 'Программирование',
  subcategory: 'Фронтенд',
  description: 'Научу создавать современные приложения.',
  images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
  isLiked: false,
  user: {
    id: 'user-456',
    name: 'Александр Афанасьев',
    avatar: 'avatar.jpg',
    city: 'Москва',
    birthday: '1995-05-20',
    skillsTeach: [{ name: 'React', category: 'education' as SkillCategorySlug }] as unknown as [],
    skillsLearn: [{ name: 'Node.js', category: 'education' as SkillCategorySlug }] as unknown as [],
    isFavorite: false,
    onFavoriteToggle: jest.fn(),
    onDetailsClick: jest.fn(),
  },
  onLikeToggle: jest.fn(),
  onShare: jest.fn(),
  onMoreClick: jest.fn(),
  onExchangeClick: jest.fn(),
};

describe('SkillCard Component', () => {
  it('renders title and description', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders UserCard mock', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
  });

  it('calls onExchangeClick on button press', () => {
    render(<SkillCard {...mockProps} />);
    const button = screen.getByText(/предложить обмен/i);
    fireEvent.click(button);
    expect(mockProps.onExchangeClick).toHaveBeenCalled();
  });
});
