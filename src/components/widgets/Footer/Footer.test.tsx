import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock('@/assets/icons/logo/logo.svg', () => 'logo.svg');
jest.mock('@/components/ui/Logo', () => ({
  Logo: () => <div>SkillSwap</div>,
}));

describe('Footer', () => {
  // Правильно отображает текст, защищенный авторским правом
  it('renders copyright text correctly', () => {
    render(<Footer />);

    expect(screen.getByText('SkillSwap - 2026')).toBeInTheDocument();
  });

  // Отображает все навигационные ссылки
  it('renders all navigation links', () => {
    render(<Footer />);

    const expectedLinks = [
      ['О проекте', '/about'],
      ['Все навыки', '/all-skills'],
      ['Контакты', '/contact-information'],
      ['Блог', '/blog'],
      ['Политика конфиденциальности', '/privacy-policy'],
      ['Пользовательское соглашение', '/terms-of-service'],
    ] as const;

    expectedLinks.forEach(([linkText, href]) => {
      const link = screen.getByText(linkText);

      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', href);
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
    expect(screen.getAllByRole('list')).toHaveLength(3);
  });
});
