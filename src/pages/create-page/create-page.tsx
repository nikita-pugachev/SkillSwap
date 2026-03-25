import React, { useState, useRef, useMemo } from 'react';
import styles from './create-page.module.scss';
import { Button, InputBaseContainerUI, InputUI, SelectInputUI } from '@/components/ui';
import galleryAddIcon from '@/assets/icons/gallery-add.svg';
import type { TSelectOption } from '@/utils/types';
import crossIcon from '@/assets/icons/cross.svg';
import SchoolBoard from '@/assets/illustrations/school-board.svg';

export default function CreatePage() {
  const [skillType, setSkillType] = useState<'teach' | 'learn'>('teach');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TSelectOption | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(-1);

  const categoryRootRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions: TSelectOption[] = [
    { id: 1, name: 'Бизнес и карьера' },
    { id: 2, name: 'Иностранные языки' },
    { id: 3, name: 'Дом и уют' },
    { id: 4, name: 'Творчество и искусств' },
    { id: 5, name: 'Образование и развитие' },
    { id: 6, name: 'Здоровье и лайфстайл' },
  ];

  const filteredCategoryOptions = useMemo(() => {
    if (!categoryInputValue.trim()) {
      return categoryOptions;
    }
    return categoryOptions.filter((option) =>
      option.name.toLowerCase().includes(categoryInputValue.toLowerCase())
    );
  }, [categoryInputValue, categoryOptions]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file);
    }
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryInputValue(e.target.value);
    setIsCategoryOpen(true);
    setActiveCategoryIndex(-1);
  };

  const handleCategoryInputFocus = () => {
    setIsCategoryOpen(true);
  };

  const handleCategoryInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCategoryOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsCategoryOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveCategoryIndex((prev) =>
          prev < filteredCategoryOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveCategoryIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeCategoryIndex >= 0 && filteredCategoryOptions[activeCategoryIndex]) {
          handleSelectCategory(filteredCategoryOptions[activeCategoryIndex]);
        }
        break;
      case 'Escape':
        setIsCategoryOpen(false);
        setActiveCategoryIndex(-1);
        break;
    }
  };

  const handleSelectCategory = (option: TSelectOption) => {
    setSelectedCategory(option);
    setCategoryInputValue(option.name);
    setIsCategoryOpen(false);
    setActiveCategoryIndex(-1);
  };

  const handleCategoryActionClick = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
      setCategoryInputValue('');
      setIsCategoryOpen(false);
      setActiveCategoryIndex(-1);
      categoryInputRef.current?.focus();
    } else {
      setIsCategoryOpen(!isCategoryOpen);
      if (!isCategoryOpen) {
        categoryInputRef.current?.focus();
      }
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    // TODO: отправка данных на сервер
    console.log('Form submitted');
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <section className={styles.formSection} aria-label="Форма создания навыка">
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.fields}>
              <InputBaseContainerUI label="Название навыка" id="skillName">
                <InputUI id="skillName" type="text" placeholder="Введите название вашего навыка" />
              </InputBaseContainerUI>

              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="skillType"
                    value="teach"
                    checked={skillType === 'teach'}
                    onChange={(e) => setSkillType(e.target.value as 'teach')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>Могу научить</span>
                </label>

                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="skillType"
                    value="learn"
                    checked={skillType === 'learn'}
                    onChange={(e) => setSkillType(e.target.value as 'learn')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>Хочу научиться</span>
                </label>
              </div>

              <SelectInputUI
                id="category"
                label="Категория"
                placeholder="Выберите категорию"
                isOpen={isCategoryOpen}
                rootRef={categoryRootRef}
                inputRef={categoryInputRef}
                inputValue={categoryInputValue}
                selectedOption={selectedCategory}
                filteredOptions={filteredCategoryOptions}
                activeOptionIndex={activeCategoryIndex}
                clearIconSrc={crossIcon}
                shouldShowClear={Boolean(selectedCategory)}
                actionAriaLabel={
                  selectedCategory ? 'Очистить категорию' : 'Открыть список категорий'
                }
                handleInputChange={handleCategoryInputChange}
                handleInputFocus={handleCategoryInputFocus}
                handleInputKeyDown={handleCategoryInputKeyDown}
                handleActionClick={handleCategoryActionClick}
                handleSelectOption={handleSelectCategory}
              />

              <div className={styles.textareaBlock}>
                <label htmlFor="description" className={styles.textareaLabel}>
                  Описание
                </label>

                <textarea
                  id="description"
                  className={styles.textarea}
                  placeholder="Коротко опишите, чему можете научить или чему хотите научиться"
                />
              </div>

              <div className={styles.uploadBlock}>
                <p className={styles.uploadText}>Перетащите или выберите изображение навыка</p>

                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />

                <label htmlFor="imageUpload" className={styles.uploadButton}>
                  <img
                    src={galleryAddIcon}
                    alt=""
                    aria-hidden="true"
                    className={styles.uploadIcon}
                  />
                  <span className={styles.uploadButtonText}>
                    {selectedImage ? selectedImage.name : 'Выбрать изображение'}
                  </span>
                </label>

                {selectedImage && (
                  <p className={styles.fileInfo}>Выбран файл: {selectedImage.name}</p>
                )}
              </div>
            </div>

            <Button type="submit" variant="primary" className={styles.submitButton}>
              Создать навык
            </Button>
          </form>
        </section>

        <section className={styles.infoSection} aria-label="О создании навыка">
          <img src={SchoolBoard} alt="Доска навыков" className={styles.infoImage} />

          <div className={styles.infoText}>
            <h2 className={styles.infoTitle}>Еще больше навыков!</h2>

            <p className={styles.infoSubtitle}>
              Информация о навыке, которым можно поделиться или который можно освоить.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
