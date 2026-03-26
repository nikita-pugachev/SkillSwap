import React, { useState, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
//import { useDispatch } from 'react-redux';
//import { useNavigate } from 'react-router-dom';
import styles from './create-page.module.scss';
import { Button, InputBaseContainerUI, InputUI, SelectInputUI } from '@/components/ui';
import galleryAddIcon from '@/assets/icons/gallery-add.svg';
import type { TSelectOption } from '@/utils/types';
import crossIcon from '@/assets/icons/cross.svg';
import SchoolBoard from '@/assets/illustrations/school-board.svg';

interface IFormData {
  skillName: string;
  skillType: 'teach' | 'learn';
  category: TSelectOption | null;
  description: string;
  image: File | null;
}

const validationSchema = yup.object({
  skillName: yup
    .string()
    .required('Название навыка обязательно')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(50, 'Название должно содержать максимум 50 символов'),
  skillType: yup.string().oneOf(['teach', 'learn']).required('Выберите тип навыка'),
  category: yup.object().nullable().required('Выберите категорию'),
  description: yup.string().max(500, 'Описание не должно превышать 500 символов'),
  image: yup
    .mixed<File>()
    .nullable()
    .test('fileType', 'Допустимы только JPEG и PNG изображения', (value) => {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      const isValid = ['image/jpeg', 'image/png'].includes(value.type);
      return isValid;
    })
    .test('fileSize', 'Размер изображения не должен превышать 2 МБ', (value) => {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      const isValid = value.size <= 2 * 1024 * 1024;
      return isValid;
    }),
});

export default function CreatePage() {
  //const dispatch = useDispatch();
  //const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [imageError, setImageError] = useState<string | null>(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(-1);

  const categoryRootRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm<IFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      skillName: '',
      skillType: 'teach',
      category: null,
      description: '',
      image: null,
    },
    mode: 'onChange',
  });

  const watchImage = watch('image');
  const watchCategory = watch('category');

  const isSubmitDisabled = !isValid || isSubmitting;

  const categoryOptions: TSelectOption[] = [
    { id: 1, name: 'Бизнес и карьера' },
    { id: 2, name: 'Иностранные языки' },
    { id: 3, name: 'Дом и уют' },
    { id: 4, name: 'Творчество и искусство' },
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;

    setImageError(null);

    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      const errorMessage = 'Допустимы только JPEG и PNG изображения';
      setImageError(errorMessage);
      setError('image', { message: errorMessage });
      onChange(null);
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      const errorMessage = 'Размер изображения не должен превышать 2 МБ';
      setImageError(errorMessage);
      setError('image', { message: errorMessage });
      onChange(null);
      return;
    }

    clearErrors('image');
    onChange(file);
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
    setValue('category', option, { shouldValidate: true });
    setCategoryInputValue(option.name);
    setIsCategoryOpen(false);
    setActiveCategoryIndex(-1);
    clearErrors('category');
  };

  const handleCategoryActionClick = () => {
    if (watchCategory) {
      setValue('category', null, { shouldValidate: true });
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setSubmitError(null);

    try {
      if (!data.skillName || !data.skillType || !data.category) {
        return;
      }

      const skillData = {
        name: data.skillName,
        type: data.skillType,
        categoryId: data.category.id,
        categoryName: data.category.name,
        description: data.description,
        imageFile: data.image,
      };

      // TODO: Интеграция с Redux skillsSlice (сейчас в skillsSlice этого нет)
      // 1. Создать асинхронный action в skillsSlice (createSkill)
      // 2. Импортировать createSkill из skillsSlice
      // 3. Заменить console.log на dispatch(createSkill(skillData)).unwrap()
      // 4. После успешного создания добавить новый навык в state.items

      console.log('Form data prepared for Redux:', skillData);

      // TODO: Временная имитация успешной отправки (удалить после интеграции с Redux)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Раскомментировать после интеграции с Redux
      // navigate('/catalog');
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);

        if (error.message.toLowerCase().includes('категори')) {
          setError('category', { message: 'Выбранная категория недоступна' });
        } else if (
          error.message.toLowerCase().includes('название') ||
          error.message.toLowerCase().includes('name')
        ) {
          setError('skillName', { message: 'Навык с таким названием уже существует' });
        } else {
          setSubmitError(`Ошибка при создании навыка: ${error.message}`);
        }
      } else {
        setSubmitError('Не удалось создать навык. Попробуйте позже.');
      }
    }
  };

  React.useEffect(() => {
    if (errors.image?.message) {
      setImageError(errors.image.message);
    } else if (!errors.image && watchImage) {
      setImageError(null);
    }
  }, [errors.image, watchImage]);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <section className={styles.formSection} aria-label="Форма создания навыка">
          <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.fields}>
              {submitError && (
                <div className={styles.submitError}>
                  <p>{submitError}</p>
                </div>
              )}

              <Controller
                name="skillName"
                control={control}
                render={({ field, fieldState }) => (
                  <InputBaseContainerUI
                    label="Название навыка"
                    id="skillName"
                    error={fieldState.error?.message}
                  >
                    <InputUI
                      id="skillName"
                      type="text"
                      placeholder="Введите название вашего навыка"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </InputBaseContainerUI>
                )}
              />

              <Controller
                name="skillType"
                control={control}
                render={({ field }) => (
                  <>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          value="teach"
                          checked={field.value === 'teach'}
                          onChange={() => field.onChange('teach')}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioText}>Могу научить</span>
                      </label>

                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          value="learn"
                          checked={field.value === 'learn'}
                          onChange={() => field.onChange('learn')}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioText}>Хочу научиться</span>
                      </label>
                    </div>
                    {errors.skillType && (
                      <p className={styles.errorMessage}>{errors.skillType.message}</p>
                    )}
                  </>
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ fieldState }) => (
                  <SelectInputUI
                    id="category"
                    label="Категория"
                    placeholder="Выберите категорию"
                    isOpen={isCategoryOpen}
                    rootRef={categoryRootRef}
                    inputRef={categoryInputRef}
                    inputValue={categoryInputValue}
                    selectedOption={watchCategory}
                    filteredOptions={filteredCategoryOptions}
                    activeOptionIndex={activeCategoryIndex}
                    clearIconSrc={crossIcon}
                    shouldShowClear={Boolean(watchCategory)}
                    actionAriaLabel={
                      watchCategory ? 'Очистить категорию' : 'Открыть список категорий'
                    }
                    error={fieldState.error?.message}
                    handleInputChange={handleCategoryInputChange}
                    handleInputFocus={handleCategoryInputFocus}
                    handleInputKeyDown={handleCategoryInputKeyDown}
                    handleActionClick={handleCategoryActionClick}
                    handleSelectOption={handleSelectCategory}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <div className={styles.textareaBlock}>
                    <label htmlFor="description" className={styles.textareaLabel}>
                      Описание
                    </label>
                    <textarea
                      id="description"
                      className={`${styles.textarea} ${fieldState.error ? styles.textareaError : ''}`}
                      placeholder="Коротко опишите, чему можете научить или чему хотите научиться"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {fieldState.error && (
                      <p className={styles.errorMessage}>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="image"
                control={control}
                render={({ field, fieldState }) => (
                  <div className={styles.uploadBlock}>
                    <p className={styles.uploadText}>Перетащите или выберите изображение навыка</p>
                    <p className={styles.uploadHint}>JPEG или PNG, до 2 МБ</p>

                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleImageChange(e, field.onChange)}
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
                        {watchImage ? watchImage.name : 'Выбрать изображение'}
                      </span>
                    </label>

                    {watchImage && (
                      <p className={styles.fileInfo}>Выбран файл: {watchImage.name}</p>
                    )}

                    {(fieldState.error || imageError) && (
                      <p className={styles.errorMessage}>
                        {fieldState.error?.message || imageError}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className={styles.submitButton}
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? 'Создание...' : 'Создать навык'}
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
