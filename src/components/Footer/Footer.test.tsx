import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('@/assets/icons/logo/logo.png', () => 'logo.png');
jest.mock('@/components/ui/Logo', () => ({
  Logo: () => <div>SkillSwap</div>,
}));

describe('Footer', () => {
  // Правильно отображает текст, защищенный авторским правом
  it('renders copyright text correctly', () => {
    render(<Footer />);

    // Проверяем точное совпадение текста
    const copyright = screen.getByText('SkillSwap - 2026');
    expect(copyright).toBeInTheDocument();
  });

  // Отображает все навигационные ссылки
  it('renders all navigation links', () => {
    render(<Footer />);

    const expectedLinks = [
      'О проекте',
      'Все навыки',
      'Контакты',
      'Блог',
      'Политика конфиденциальности',
      'Пользовательское соглашение',
    ];

    expectedLinks.forEach((linkText) => {
      const link = screen.getByText(linkText);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });
  });

  // Отображает все необходимые разделы
  it('renders all required sections', () => {
    render(<Footer />);

    // Проверяем наличие футера
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    // Проверяем наличие логотипа
    expect(screen.getByText('SkillSwap')).toBeInTheDocument();

    // Проверяем количество списков
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(3);
  });
});
