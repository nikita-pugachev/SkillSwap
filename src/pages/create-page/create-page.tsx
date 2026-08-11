import { useState, type ChangeEvent } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './create-page.module.scss';
import { Button, InputBaseContainerUI, InputUI, RadioGroup } from '@/components/ui';
import { SelectInput } from '@/components/SelectInput';
import { CATEGORIES } from '@/data/categories';
import galleryAddIcon from '@/assets/icons/gallery-add.svg';
import type { TSelectOption } from '@/utils/types';
import SchoolBoard from '@/assets/illustrations/school-board.svg';

type FormData = {
  skillName: string;
  skillType: 'teach' | 'learn';
  category: TSelectOption | null;
  subcategory: TSelectOption | null;
  description: string;
  image: File | null;
};

type CategoryOption = TSelectOption & {
  subcategories: TSelectOption[];
};

const SKILL_TYPE_OPTIONS = [
  { label: 'Могу научить', value: 'teach' },
  { label: 'Хочу научиться', value: 'learn' },
] as const;

const CATEGORY_OPTIONS: CategoryOption[] = CATEGORIES.map((category, categoryIndex) => ({
  id: categoryIndex + 1,
  name: category.title,
  subcategories: category.subs.map((subcategory, subcategoryIndex) => ({
    id: (categoryIndex + 1) * 100 + subcategoryIndex + 1,
    name: subcategory,
  })),
}));

const validationSchema: yup.ObjectSchema<FormData> = yup
  .object({
    skillName: yup
      .string()
      .required('Название навыка обязательно')
      .min(3, 'Название должно содержать минимум 3 символа')
      .max(50, 'Название должно содержать максимум 50 символов'),
    skillType: yup
      .mixed<FormData['skillType']>()
      .oneOf(['teach', 'learn'])
      .required('Выберите тип навыка'),
    category: yup.mixed<TSelectOption>().nullable().required('Выберите категорию'),
    subcategory: yup
      .mixed<TSelectOption>()
      .nullable()
      .defined()
      .test('subcategory-required', 'Выберите подкатегорию', function validateSubcategory(value) {
        const { category } = this.parent as FormData;

        if (!category) {
          return true;
        }

        return value !== null;
      }),
    description: yup.string().defined().max(500, 'Описание не должно превышать 500 символов'),
    image: yup
      .mixed<File>()
      .nullable()
      .defined()
      .test('fileType', 'Допустимы только JPEG и PNG изображения', (value) => {
        if (!value) {
          return true;
        }

        return ['image/jpeg', 'image/png'].includes(value.type);
      })
      .test('fileSize', 'Размер изображения не должен превышать 2 МБ', (value) => {
        if (!value) {
          return true;
        }

        return value.size <= 2 * 1024 * 1024;
      }),
  })
  .required();

export default function CreatePage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    resetField,
    setError,
    clearErrors,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      skillName: '',
      skillType: 'teach',
      category: null,
      subcategory: null,
      description: '',
      image: null,
    },
    mode: 'onChange',
  });

  const selectedCategory = useWatch({ control, name: 'category' });
  const selectedImage = useWatch({ control, name: 'image' });

  const subcategoryOptions =
    CATEGORY_OPTIONS.find((category) => category.id === selectedCategory?.id)?.subcategories ?? [];

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setError('image', { message: 'Допустимы только JPEG и PNG изображения' });
      onChange(null);
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      setError('image', { message: 'Размер изображения не должен превышать 2 МБ' });
      onChange(null);
      return;
    }

    clearErrors('image');
    onChange(file);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);

    try {
      if (!data.category || !data.subcategory) {
        return;
      }

      const skillData = {
        name: data.skillName,
        type: data.skillType,
        categoryId: data.category.id,
        categoryName: data.category.name,
        subcategoryId: data.subcategory.id,
        subcategoryName: data.subcategory.name,
        description: data.description,
        imageFile: data.image,
      };

      console.log('Form data prepared for Redux:', skillData);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);

        if (error.message.toLowerCase().includes('категор')) {
          setError('category', { message: 'Выбранная категория недоступна' });
        } else if (error.message.toLowerCase().includes('подкатегор')) {
          setError('subcategory', { message: 'Выбранная подкатегория недоступна' });
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
                  <RadioGroup
                    aria-label="Тип навыка"
                    name={field.name}
                    items={[...SKILL_TYPE_OPTIONS]}
                    value={field.value}
                    onChange={(value) => field.onChange(value as FormData['skillType'])}
                    orientation="horizontal"
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <SelectInput
                    id="category"
                    label="Категория навыка"
                    placeholder="Выберите категорию навыка"
                    options={CATEGORY_OPTIONS}
                    defaultValue={field.value?.name ?? ''}
                    error={fieldState.error?.message}
                    isOpen={openSelectId === 'category'}
                    onToggle={(next) => setOpenSelectId(next ? 'category' : null)}
                    onChange={(option) => {
                      const selectedOption = option as CategoryOption | null;

                      field.onChange(selectedOption);

                      if (selectedOption) {
                        clearErrors('category');
                      }

                      if (selectedOption?.id !== field.value?.id) {
                        resetField('subcategory', { defaultValue: null });
                      }
                    }}
                  />
                )}
              />

              <Controller
                name="subcategory"
                control={control}
                render={({ field, fieldState }) => (
                  <SelectInput
                    id="subcategory"
                    label="Подкатегория навыка"
                    placeholder={
                      selectedCategory
                        ? 'Выберите подкатегорию навыка'
                        : 'Сначала выберите категорию'
                    }
                    options={subcategoryOptions}
                    defaultValue={field.value?.name ?? ''}
                    error={fieldState.error?.message}
                    disabled={!selectedCategory}
                    isOpen={openSelectId === 'subcategory'}
                    onToggle={(next) => setOpenSelectId(next ? 'subcategory' : null)}
                    onChange={(option) => {
                      field.onChange(option);

                      if (option) {
                        clearErrors('subcategory');
                      }
                    }}
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

                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/jpeg,image/png"
                      onChange={(event) => handleImageChange(event, field.onChange)}
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

                    {fieldState.error && (
                      <p className={styles.errorMessage}>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className={styles.submitButton}
              disabled={!isValid || isSubmitting}
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
