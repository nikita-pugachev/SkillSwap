import React, { useState, useRef, useEffect } from 'react';
import styles from './CategoryDropdown.module.scss';

const CATEGORIES = [
  {
    title: 'Бизнес и карьера',
    iconSrc: 'src/assets/icons/skills-category/icon-business-career.svg',
    subs: [
      'Управление командой',
      'Маркетинг и реклама',
      'Продажи и переговоры',
      'Личный бренд',
      'Резюме и собеседование',
      'Тайм-менеджмент',
      'Проектное управление',
      'Предпренимательство',
    ],
    color: 'var(--color-tag-business)',
  },
  {
    title: 'Иностранные языки',
    iconSrc: 'src/assets/icons/skills-category/icon-languages.svg',
    subs: [
      'Английский',
      'Французский',
      'Испанский',
      'Немецкий',
      'Китайский',
      'Японский',
      'Подготовка к экзаменам (IELTS, TOEFL)',
    ],
    color: 'var(--color-tag-languages)',
  },
  {
    title: 'Дом и уют',
    iconSrc: 'src/assets/icons/skills-category/icon-home.svg',
    subs: [
      'Уборка и организация',
      'Домашние финансы',
      'Приготовление еды',
      'Домашние растения',
      'Ремонт',
      'Хранение вещей',
    ],
    color: 'var(--color-tag-home)',
  },
  {
    title: 'Творчество и искусство',
    iconSrc: 'src/assets/icons/skills-category/icon-art.svg',
    subs: [
      'Рисование и иллюстрация',
      'Фотография',
      'Видеомонтаж',
      'Музыка и звук',
      'Актёрское мастерство',
      'Креативное письмо',
      'Арт-терапия',
      'Декор и DIY',
    ],
    color: 'var(--color-tag-art)',
  },
  {
    title: 'Образование и развитие',
    iconSrc: 'src/assets/icons/skills-category/icon-education.svg',
    subs: [
      'Личностное развитие',
      'Навыки обучения',
      'Когнитивные техники',
      'Скорочтение',
      'Навыки преподавания',
      'Коучинг',
    ],
    color: 'var(--color-tag-education)',
  },
  {
    title: 'Здоровье и лайфстайл',
    iconSrc: 'src/assets/icons/skills-category/icon-health.svg',
    subs: [
      'Йога и медитация',
      'Питание и ЗОЖ',
      'Ментальное здоровье',
      'Осознанность',
      'Физические тренировки',
      'Сон и восстановление',
      'Баланс жизни и работы',
    ],
    color: 'var(--color-tag-health)',
  },
];

interface CategoryDropdownProps {
  onCategorySelect?: (value: string) => void;
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  onCategorySelect,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    onCategorySelect?.(value);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.dropdownButton} ${className}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Все навыки"
      >
        <span>Все навыки</span>

        <img
          src="src/assets/icons/chevron-down.svg"
          alt=""
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width={24}
          height={24}
        />
      </button>

      {isOpen && (
        <div ref={menuRef} className={styles.menuPanel}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={styles.column}>
                {CATEGORIES.slice(0, 3).map((cat) => (
                  <div key={cat.title} className={styles.categoryRow}>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleSelect(cat.title)}
                      aria-label={cat.title}
                    >
                      <div className={styles.categoryIcon} style={{ backgroundColor: cat.color }}>
                        <img
                          src={cat.iconSrc}
                          alt={cat.title}
                          className={styles.categoryIconImage}
                          width={24}
                          height={24}
                        />
                      </div>
                    </button>

                    <div className={styles.contentColumn}>
                      <button
                        className={styles.categoryButton}
                        onClick={() => handleSelect(cat.title)}
                      >
                        <span className={styles.categoryName}>{cat.title}</span>
                      </button>

                      <ul className={styles.subcategoryList}>
                        {cat.subs.map((sub) => (
                          <li key={sub}>
                            <button
                              className={styles.subcategoryButton}
                              onClick={() => handleSelect(sub)}
                            >
                              {sub}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.column}>
                {CATEGORIES.slice(3).map((cat) => (
                  <div key={cat.title} className={styles.categoryRow}>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleSelect(cat.title)}
                      aria-label={cat.title}
                    >
                      <div className={styles.categoryIcon} style={{ backgroundColor: cat.color }}>
                        <img
                          src={cat.iconSrc}
                          alt={cat.title}
                          className={styles.categoryIconImage}
                          width={24}
                          height={24}
                        />
                      </div>
                    </button>

                    <div className={styles.contentColumn}>
                      <button
                        className={styles.categoryButton}
                        onClick={() => handleSelect(cat.title)}
                      >
                        <span className={styles.categoryName}>{cat.title}</span>
                      </button>

                      <ul className={styles.subcategoryList}>
                        {cat.subs.map((sub) => (
                          <li key={sub}>
                            <button
                              className={styles.subcategoryButton}
                              onClick={() => handleSelect(sub)}
                            >
                              {sub}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
