import { render, screen } from '@testing-library/react';
import { SkillTag } from './SkillTag';

describe('SkillTag', () => {
  // 1. Базовый рендер learn
  it('renders learn variant correctly', () => {
    render(<SkillTag label="Медитация" variant="learn" />);
    expect(screen.getByText('Медитация')).toBeInTheDocument();
  });

  // 2. Рендер teach с разными категориями (проверяем только текст)
  const categories = [
    { category: 'business', label: 'Бизнес' },
    { category: 'art', label: 'Рисование' },
    { category: 'languages', label: 'Английский' },
    { category: 'home', label: 'Готовка' },
    { category: 'health', label: 'Йога' },
    { category: 'other', label: 'Другое' },
  ] as const;

  categories.forEach(({ category, label }) => {
    it(`renders teach variant with ${category} category`, () => {
      render(<SkillTag label={label} variant="teach" category={category} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  // 3. Проверка счетчика
  it('shows count when provided', () => {
    render(<SkillTag label="React" variant="learn" count={3} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('does not show count when count is 0', () => {
    render(<SkillTag label="React" variant="learn" count={0} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('+0')).not.toBeInTheDocument();
  });

  it('does not show count when not provided', () => {
    render(<SkillTag label="React" variant="learn" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  // 4. learn с category (проверяем что category игнорируется)
  it('renders learn variant even with category', () => {
    render(<SkillTag label="Медитация" variant="learn" category="health" />);
    expect(screen.getByText('Медитация')).toBeInTheDocument();
    // Счетчика быть не должно
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });
});
