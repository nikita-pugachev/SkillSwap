jest.mock('@/components/ui/CheckboxButton', () => ({
  __esModule: true,
  CheckboxButton: ({ label, onChange }: { label: string; onChange?: () => void }) => (
    <input type="checkbox" aria-label={label} onChange={onChange} />
  ),
}));

jest.mock('@/assets/icons/chevron-down.svg?react', () => ({
  __esModule: true,
  default: () => <svg data-testid="chevron-down" />,
}));

jest.mock('@/assets/icons/chevron-up.svg?react', () => ({
  __esModule: true,
  default: () => <svg data-testid="chevron-up" />,
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { SkillCategory } from './SkillCategory';

const category = {
  id: 1,
  title: 'Иностранные языки',
  icon: 'languages',
  subcategories: [
    { id: 101, title: 'Английский' },
    { id: 102, title: 'Немецкий' },
  ],
};

describe('SkillCategory', () => {
  const mockToggleExpand = jest.fn();
  const mockToggleCategoryCheckbox = jest.fn();
  const mockToggleSubcategory = jest.fn();

  const defaultProps = {
    category,
    expanded: false,
    checkedSubcategories: [] as number[],
    onToggleExpand: mockToggleExpand,
    onToggleCategoryCheckbox: mockToggleCategoryCheckbox,
    onToggleSubcategory: mockToggleSubcategory,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders category checkbox', () => {
    render(<SkillCategory {...defaultProps} />);
    expect(screen.getByRole('checkbox', { name: 'Иностранные языки' })).toBeInTheDocument();
  });

  test('subcategories are hidden when collapsed', () => {
    render(<SkillCategory {...defaultProps} />);
    expect(screen.queryByRole('checkbox', { name: 'Английский' })).not.toBeInTheDocument();
  });

  test('subcategories appear when expanded', () => {
    render(<SkillCategory {...defaultProps} expanded={true} />);
    expect(screen.getByRole('checkbox', { name: 'Английский' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Немецкий' })).toBeInTheDocument();
  });

  test('calls onToggleExpand when chevron clicked', () => {
    render(<SkillCategory {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleExpand).toHaveBeenCalledWith(1);
  });

  test('calls onToggleCategoryCheckbox when category checkbox clicked', () => {
    render(<SkillCategory {...defaultProps} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Иностранные языки' }));
    expect(mockToggleCategoryCheckbox).toHaveBeenCalledWith(1);
  });

  test('calls onToggleSubcategory when subcategory clicked', () => {
    render(<SkillCategory {...defaultProps} expanded={true} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Английский' }));
    expect(mockToggleSubcategory).toHaveBeenCalledWith(1, 101);
  });
});
