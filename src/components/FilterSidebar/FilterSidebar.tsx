import { useState } from 'react';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { CheckboxButton } from '@/components/ui/CheckboxButton';
import { SkillCategory } from '@/components/ui';

import styles from './FilterSidebar.module.scss';

import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ChevronUp from '@/assets/icons/chevron-up.svg?react';
import CrossIcon from '@/assets/icons/cross.svg?react';

type SkillSubcategory = {
  id: number;
  title: string;
};

export type SkillCategoryData = {
  id: number;
  title: string;
  icon: string;
  subcategories: SkillSubcategory[];
};

export interface FilterSidebarProps {
  filters: {
    mode: 'all' | 'wantToLearn' | 'canTeach';
    skills: number[];
    gender: 'Мужской' | 'Женский' | null;
    city: string[];
  };
  onChange: (newFilters: Partial<FilterSidebarProps['filters']>) => void;
  onReset: () => void;
  activeFiltersCount: number;
  canReset?: boolean;
  cities?: string[];
  categories?: SkillCategoryData[];
}

const useExpandedCategories = (categories: SkillCategoryData[]) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (categoryId: number) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleAll = () => {
    const hasExpanded = Object.values(expanded).some((val) => val);
    const newExpanded: Record<number, boolean> = {};

    categories.forEach((cat) => {
      newExpanded[cat.id] = !hasExpanded;
    });

    setExpanded(newExpanded);
  };

  const isAnyExpanded = Object.values(expanded).some((val) => val);

  return { expanded, toggleExpand, toggleAll, isAnyExpanded };
};

export const FilterSidebar = ({
  filters,
  onChange,
  onReset,
  activeFiltersCount,
  canReset,
  cities = [],
  categories = [],
}: FilterSidebarProps) => {
  const { expanded, toggleExpand, toggleAll, isAnyExpanded } = useExpandedCategories(categories);
  const [expandedCities, setExpandedCities] = useState(false);
  const shouldShowReset = canReset ?? activeFiltersCount > 0;

  const handleModeChange = (value: string) => {
    onChange({ mode: value as 'all' | 'wantToLearn' | 'canTeach' });
  };

  const handleGenderChange = (value: string) => {
    let gender: 'Мужской' | 'Женский' | null = null;

    if (value === 'male') gender = 'Мужской';
    else if (value === 'female') gender = 'Женский';

    onChange({ gender });
  };

  const handleCityToggle = (city: string) => {
    const newCities = filters.city.includes(city)
      ? filters.city.filter((c) => c !== city)
      : [...filters.city, city];

    onChange({ city: newCities });
  };

  const handleToggleCategoryCheckbox = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const subIds = category.subcategories.map((sub) => sub.id);
    const allSelected = subIds.every((id) => filters.skills.includes(id));

    const newSkills = allSelected
      ? filters.skills.filter((id) => !subIds.includes(id))
      : [...new Set([...filters.skills, ...subIds])];

    onChange({ skills: newSkills });
  };

  const handleToggleSubcategory = (categoryId: number, subcategoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const isValid = category?.subcategories.some((sub) => sub.id === subcategoryId);

    if (!isValid) return;

    const newSkills = filters.skills.includes(subcategoryId)
      ? filters.skills.filter((id) => id !== subcategoryId)
      : [...filters.skills, subcategoryId];

    onChange({ skills: newSkills });
  };

  const genderValue =
    filters.gender === 'Мужской' ? 'male' : filters.gender === 'Женский' ? 'female' : 'any';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Фильтры{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
        </h2>

        {shouldShowReset && (
          <button type="button" className={styles.resetButton} onClick={onReset}>
            <span>Сбросить</span>
            <CrossIcon className={styles.resetIcon} />
          </button>
        )}
      </div>

      <RadioGroup
        legend=""
        name="mode"
        items={[
          { label: 'Всё', value: 'all' },
          { label: 'Хочу научиться', value: 'wantToLearn' },
          { label: 'Могу научить', value: 'canTeach' },
        ]}
        value={filters.mode}
        onChange={handleModeChange}
      />

      {categories.length > 0 && (
        <div className={styles.filterGroup}>
          <h3 className={styles.groupTitle}>Навыки</h3>

          <div className={styles.categoryTree}>
            {categories.map((category) => (
              <SkillCategory
                key={category.id}
                category={category}
                expanded={expanded[category.id] || false}
                checkedSubcategories={filters.skills}
                onToggleExpand={toggleExpand}
                onToggleCategoryCheckbox={handleToggleCategoryCheckbox}
                onToggleSubcategory={handleToggleSubcategory}
              />
            ))}
          </div>

          <button type="button" onClick={toggleAll} className={styles.allCategoriesButton}>
            Все категории
            {isAnyExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      )}

      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>Пол автора</h3>
        <RadioGroup
          legend=""
          name="gender"
          items={[
            { label: 'Не имеет значения', value: 'any' },
            { label: 'Мужской', value: 'male' },
            { label: 'Женский', value: 'female' },
          ]}
          value={genderValue}
          onChange={handleGenderChange}
        />
      </div>

      {cities.length > 0 && (
        <div className={styles.filterGroup}>
          <h3 className={styles.groupTitle}>Город</h3>

          <div className={styles.checkboxList}>
            {(expandedCities ? cities : cities.slice(0, 5)).map((city) => (
              <CheckboxButton
                key={city}
                label={city}
                state={filters.city.includes(city) ? 'checked' : 'empty'}
                onChange={() => handleCityToggle(city)}
              />
            ))}
          </div>

          {cities.length > 5 && (
            <button
              type="button"
              onClick={() => setExpandedCities((prev) => !prev)}
              className={styles.allCategoriesButton}
            >
              Все города
              {expandedCities ? <ChevronUp /> : <ChevronDown />}
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
