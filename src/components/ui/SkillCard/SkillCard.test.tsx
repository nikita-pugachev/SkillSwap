import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkillCard } from './SkillCard';
import type { SkillCardProps } from './SkillCard';

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
}));

jest.mock('@/components/ui/SkillTag', () => ({
  SkillTag: ({ label }: { label: string }) => <span data-testid="skill-tag">{label}</span>,
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
    skillsTeach: [{ name: 'React', category: 'education' }],
    skillsLearn: [{ name: 'Node.js', category: 'education' }],
  },
  onLikeToggle: jest.fn(),
  onShare: jest.fn(),
  onMoreClick: jest.fn(),
  onExchangeClick: jest.fn(),
};

describe('SkillCard Component', () => {
  const setupUser = () => userEvent.setup();

  it('renders title and description', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders custom author block matching mockup', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByText('Александр Афанасьев')).toBeInTheDocument();
    expect(screen.getByText(/Москва, \d+ (год|года|лет)/)).toBeInTheDocument();
    expect(screen.getAllByTestId('skill-tag').length).toBe(2);
  });

  it('handles empty images array gracefully', () => {
    render(<SkillCard {...mockProps} images={[]} />);
    expect(screen.getByText('Нет фото')).toBeInTheDocument();
  });

  it('toggles isLiked correctly', () => {
    const { rerender } = render(<SkillCard {...mockProps} isLiked={false} />);
    expect(screen.getByLabelText('Добавить в избранное')).toBeInTheDocument();

    rerender(<SkillCard {...mockProps} isLiked={true} />);
    expect(screen.getByLabelText('Убрать из избранного')).toBeInTheDocument();
  });

  it('calls onExchangeClick on button press using userEvent', async () => {
    const user = setupUser();
    render(<SkillCard {...mockProps} />);
    const button = screen.getByText(/предложить обмен/i);

    await user.click(button);
    expect(mockProps.onExchangeClick).toHaveBeenCalledTimes(1);
  });
});
