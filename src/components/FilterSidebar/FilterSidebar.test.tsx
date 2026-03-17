import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterSidebar } from './FilterSidebar';
import type { SkillCategoryData } from '@/utils/types';

jest.mock('./FilterSidebar.module.scss', () => ({
  __esModule: true,
  default: {
    sidebar: 'sidebar',
    title: 'title',
    filterGroup: 'filterGroup',
    groupTitle: 'groupTitle',
    categoryTree: 'categoryTree',
    allCategoriesButton: 'allCategoriesButton',
    checkboxList: 'checkboxList',
  },
}));

jest.mock('@/assets/icons/chevron-down.svg?react', () => ({
  __esModule: true,
  default: () => <span>down</span>,
}));

jest.mock('@/assets/icons/chevron-up.svg?react', () => ({
  __esModule: true,
  default: () => <span>up</span>,
}));

// Мокаем RadioGroup как набор обычных кнопок
jest.mock('@/components/ui/RadioGroup', () => ({
  RadioGroup: ({
    name,
    items,
    value,
    onChange,
  }: {
    name: string;
    items: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div data-testid={`radio-group-${name}`}>
      <div>current: {value}</div>
      {items.map((item) => (
        <button key={item.value} type="button" onClick={() => onChange(item.value)}>
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

// Мокаем CheckboxButton как кнопку
jest.mock('@/components/ui/CheckboxButton', () => ({
  CheckboxButton: ({
    label,
    onChange,
  }: {
    label: string;
    state: 'empty' | 'checked' | 'indeterminate';
    onChange: () => void;
  }) => (
    <button type="button" onClick={onChange}>
      {label}
    </button>
  ),
}));

// Мокаем SkillCategory так, чтобы можно было отдельно дергать все его коллбеки
jest.mock('@/components/ui', () => ({
  SkillCategory: ({
    category,
    expanded,
    onToggleExpand,
    onToggleCategoryCheckbox,
    onToggleSubcategory,
  }: {
    category: SkillCategoryData;
    expanded: boolean;
    checkedSubcategories: number[];
    onToggleExpand: (categoryId: number) => void;
    onToggleCategoryCheckbox: (categoryId: number) => void;
    onToggleSubcategory: (categoryId: number, subcategoryId: number) => void;
  }) => (
    <div data-testid={`category-${category.id}`}>
      <span>{category.title}</span>
      <span>{expanded ? 'expanded' : 'collapsed'}</span>

      <button type="button" onClick={() => onToggleExpand(category.id)}>
        expand-{category.id}
      </button>

      <button type="button" onClick={() => onToggleCategoryCheckbox(category.id)}>
        toggle-category-{category.id}
      </button>

      {category.subcategories.map((sub) => (
        <button key={sub.id} type="button" onClick={() => onToggleSubcategory(category.id, sub.id)}>
          toggle-sub-{sub.id}
        </button>
      ))}
    </div>
  ),
}));

describe('FilterSidebar', () => {
  const categories: SkillCategoryData[] = [
    {
      id: 1,
      title: 'Иностранные языки',
      icon: 'languages',
      subcategories: [
        { id: 101, title: 'Английский' },
        { id: 102, title: 'Немецкий' },
      ],
    },
    {
      id: 2,
      title: 'Бизнес',
      icon: 'business',
      subcategories: [{ id: 201, title: 'Маркетинг' }],
    },
  ];

  const cities = ['Москва', 'СПб', 'Казань', 'Сочи', 'Тюмень', 'Омск', 'Томск'];

  const defaultFilters = {
    mode: 'all' as const,
    skills: [] as number[],
    gender: null as 'Мужской' | 'Женский' | null,
    city: [] as string[],
  };

  const setup = (overrides?: Partial<React.ComponentProps<typeof FilterSidebar>>) => {
    const onChange = jest.fn();

    render(
      <FilterSidebar
        filters={defaultFilters}
        onChange={onChange}
        cities={cities}
        categories={categories}
        {...overrides}
      />
    );

    return { onChange };
  };

  // Проверяем, что рендерятся заголовок и все основные секции
  it('renders the title and main sections', () => {
    setup();

    expect(screen.getByText('Фильтры')).toBeInTheDocument();
    expect(screen.getByText('Навыки')).toBeInTheDocument();
    expect(screen.getByText('Пол автора')).toBeInTheDocument();
    expect(screen.getByText('Город')).toBeInTheDocument();
  });

  // Проверяем, что вызывается onChange при смене mode
  it('calls onChange when mode is changed', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByRole('button', { name: 'Хочу научиться' }));

    expect(onChange).toHaveBeenCalledWith({ mode: 'wantToLearn' });
  });

  // Проверяем, что вызывается onChange при выборе мужского пола
  it('calls onChange when male gender is selected', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByRole('button', { name: 'Мужской' }));

    expect(onChange).toHaveBeenCalledWith({ gender: 'Мужской' });
  });

  // Проверяем, что вызывается onChange при выборе женского пола
  it('calls onChange when female gender is selected', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByRole('button', { name: 'Женский' }));

    expect(onChange).toHaveBeenCalledWith({ gender: 'Женский' });
  });

  // Проверяем, что вызывается onChange при добавлении города в фильтр
  it('calls onChange when a city is added to the filter', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByRole('button', { name: 'Москва' }));

    expect(onChange).toHaveBeenCalledWith({ city: ['Москва'] });
  });

  // Проверяем, что вызывается onChange при удалении города из фильтра
  it('calls onChange when a city is removed from the filter', async () => {
    const user = userEvent.setup();
    const { onChange } = setup({
      filters: {
        ...defaultFilters,
        city: ['Москва'],
      },
    });

    await user.click(screen.getByRole('button', { name: 'Москва' }));

    expect(onChange).toHaveBeenCalledWith({ city: [] });
  });

  // Проверяем, что по умолчанию показываются только первые 5 городов
  it('calls onChange when the default cities are displayed', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Москва' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'СПб' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Казань' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сочи' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Тюмень' })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Омск' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Томск' })).not.toBeInTheDocument();
  });

  // Проверяем, что после клика на "Все города" отображаются все города
  it('calls onChange when all cities are displayed after clicking "Все города"', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: /Все города/i }));

    expect(screen.getByRole('button', { name: 'Омск' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Томск' })).toBeInTheDocument();
  });

  // Проверяем, что при клике на категорию выбираются все её подкатегории, если не все выбраны
  it('calls onChange when all subcategories of a category are selected if not all are selected', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByRole('button', { name: 'toggle-category-1' }));

    expect(onChange).toHaveBeenCalledWith({ skills: [101, 102] });
  });

  // Проверяем, что при клике на категорию снимаются все её подкатегории, если они уже выбраны
  it('calls onChange when all subcategories of a category are deselected if all are selected', async () => {
    const user = userEvent.setup();
    const { onChange } = setup({
      filters: {
        ...defaultFilters,
        skills: [101, 102, 201],
      },
    });

    await user.click(screen.getByRole('button', { name: 'toggle-category-1' }));

    expect(onChange).toHaveBeenCalledWith({ skills: [201] });
  });

  // Проверяем, что при клике на подкатегорию она добавляется в фильтр, если не была выбрана
  it('calls onChange when a subcategory is added to the filter', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.click(screen.getByRole('button', { name: 'toggle-sub-101' }));

    expect(onChange).toHaveBeenCalledWith({ skills: [101] });
  });

  // Проверяем, что при клике на подкатегорию она удаляется из фильтра, если уже была выбрана
  it('calls onChange when a subcategory is removed from the filter', async () => {
    const user = userEvent.setup();
    const { onChange } = setup({
      filters: {
        ...defaultFilters,
        skills: [101, 102],
      },
    });

    await user.click(screen.getByRole('button', { name: 'toggle-sub-101' }));

    expect(onChange).toHaveBeenCalledWith({ skills: [102] });
  });

  // Проверяем, что при клике на кнопку "Все категории" раскрываются все категории
  it('calls onChange when all categories are expanded after clicking "Все категории"', async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.getAllByText('collapsed')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: /Все категории/i }));

    expect(screen.getAllByText('expanded')).toHaveLength(2);
  });
});
