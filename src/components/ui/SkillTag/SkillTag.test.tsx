import { render, screen } from '@testing-library/react';
import { SkillTag } from './SkillTag';

describe('SkillTag', () => {
  // 1. Базовый рендер
  it('renders skill tag with label correctly', () => {
    render(<SkillTag label="Медитация" />);
    expect(screen.getByText('Медитация')).toBeInTheDocument();
  });

  // 2. Рендер с разными категориями (проверяем только текст)
  const categories = [
    { category: 'education', label: 'Образование' },
    { category: 'business', label: 'Бизнес' },
    { category: 'art', label: 'Искусство' },
    { category: 'languages', label: 'Иностранные языки' },
    { category: 'home', label: 'Дом' },
    { category: 'health', label: 'Здоровье' },
    { category: 'other', label: 'Другое' },
  ] as const;

  categories.forEach(({ category, label }) => {
    it(`renders with ${category} category`, () => {
      render(<SkillTag label={label} category={category} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  // 3. Проверка счетчика
  it('shows count when provided', () => {
    render(<SkillTag label="React" count={3} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('does not show count when count is 0', () => {
    render(<SkillTag label="React" count={0} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('+0')).not.toBeInTheDocument();
  });

  it('does not show count when not provided', () => {
    render(<SkillTag label="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  // 4. Проверка что категория применяется даже с count
  it('renders with category and count together', () => {
    render(<SkillTag label="JavaScript" category="business" count={5} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
  });
});
