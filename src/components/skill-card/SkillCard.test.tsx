import { render, screen, fireEvent } from '@testing-library/react';
import { SkillCard, SkillCardProps } from './SkillCard';
import React from 'react';
import { SkillCategorySlug, UserSkill } from '@/utils/types';
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
  description: 'Научу создавать современные веб-приложения с использованием React и TypeScript.',
  images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'],
  isLiked: false,
  user: {
    id: 'user-456',
    name: 'Александр Афанасьев',
    avatar: 'avatar.jpg',
    city: 'Москва',
    birthday: '1995-05-20',
    // Исправленная типизация объектов навыков
    skillsTeach: [{ name: 'React', category: 'it' as SkillCategorySlug }] as UserSkill[],
    skillsLearn: [{ name: 'Node.js', category: 'it' as SkillCategorySlug }] as UserSkill[],
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
  it('должен корректно отображать заголовок и описание', () => {
    render(<SkillCard {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockProps.category} / ${mockProps.subcategory}`)
    ).toBeInTheDocument();
  });

  it('должен рендерить компонент UserCard', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
  });

  it('должен вызывать onExchangeClick при нажатии на кнопку предложения обмена', () => {
    render(<SkillCard {...mockProps} />);
    const exchangeButton = screen.getByText(/предложить обмен/i);

    fireEvent.click(exchangeButton);
    expect(mockProps.onExchangeClick).toHaveBeenCalledTimes(1);
  });

  it('должен корректно отображать счетчик оставшихся фотографий', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });
});
