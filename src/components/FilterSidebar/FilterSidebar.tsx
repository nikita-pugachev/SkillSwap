import { useState } from 'react';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { CheckboxButton } from '@/components/ui/CheckboxButton';
import { SkillCategory } from '@/components/ui';
import styles from './FilterSidebar.module.scss';

import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ChevronUp from '@/assets/icons/chevron-up.svg?react';

import type { Skill, Filters } from '@/utils/types';

export type { Skill };

export interface FilterSidebarProps {
  filters: Filters;
  onChange: (newFilters: Partial<Filters>) => void;
  cities?: string[];
  categories?: Skill[];
}

// Хук для управления раскрытием категорий (без эффекта)
const useExpandedCategories = (categories: Skill[]) => {
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
  cities = [],
  categories = [],
}: FilterSidebarProps) => {
  const { expanded, toggleExpand, toggleAll, isAnyExpanded } = useExpandedCategories(categories);

  // Обработчик изменения режима (роли)
  const handleModeChange = (value: string) => {
    onChange({ mode: value as Filters['mode'] });
  };

  // Обработчик изменения пола
  const handleGenderChange = (value: string) => {
    let gender: Filters['gender'] = null;
    if (value === 'male') gender = 'Мужской';
    else if (value === 'female') gender = 'Женский';
    onChange({ gender });
  };

  // Обработчик выбора города
  const handleCityToggle = (city: string) => {
    const newCities = filters.city.includes(city)
      ? filters.city.filter((c) => c !== city)
      : [...filters.city, city];
    onChange({ city: newCities });
  };

  const [expandedCities, setExpandedCities] = useState(false);

  // Обработчик чекбокса категории (выбрать/снять все подкатегории)
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

  // Обработчик чекбокса подкатегории
  const handleToggleSubcategory = (categoryId: number, subcategoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const isValid = category?.subcategories.some((sub) => sub.id === subcategoryId);

    if (!isValid) return;

    const newSkills = filters.skills.includes(subcategoryId)
      ? filters.skills.filter((id) => id !== subcategoryId)
      : [...filters.skills, subcategoryId];

    onChange({ skills: newSkills });
  };

  // Преобразуем текущее значение пола в формат для RadioGroup
  const genderValue =
    filters.gender === 'Мужской' ? 'male' : filters.gender === 'Женский' ? 'female' : 'any';

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Фильтры</h2>

      {/* Режим (роль) */}
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

      {/* Навыки */}
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

      {/* Пол автора */}
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

      {/* Города */}
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
