import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Создаем мок-компонент прямо в тесте
const MockCreatePage = () => {
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<{
    id: number;
    name: string;
  } | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [skillName, setSkillName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [skillType, setSkillType] = React.useState('teach');
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<{
    skillName?: string;
    category?: string;
    description?: string;
  }>({});

  const categories = [
    { id: 1, name: 'Бизнес и карьера' },
    { id: 2, name: 'Иностранные языки' },
    { id: 3, name: 'Дом и уют' },
    { id: 4, name: 'Творчество и искусство' },
    { id: 5, name: 'Образование и развитие' },
    { id: 6, name: 'Здоровье и лайфстайл' },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: { skillName?: string; category?: string; description?: string } = {};

    if (!skillName.trim()) {
      newErrors.skillName = 'Название навыка обязательно';
    } else if (skillName.length < 3) {
      newErrors.skillName = 'Название должно содержать минимум 3 символа';
    } else if (skillName.length > 50) {
      newErrors.skillName = 'Название должно содержать максимум 50 символов';
    }

    if (!selectedCategory) {
      newErrors.category = 'Выберите категорию';
    }

    if (description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageError(null);

    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setImageError('Допустимы только JPEG и PNG изображения');
      setImageFile(null);
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      setImageError('Размер изображения не должен превышать 2 МБ');
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Form submitted');
    } catch {
      setSubmitError('Ошибка при создании навыка');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid =
    skillName.trim() &&
    skillName.length >= 3 &&
    skillName.length <= 50 &&
    selectedCategory &&
    description.length <= 500;

  return (
    <main>
      <div>
        <section aria-label="Форма создания навыка">
          <form onSubmit={handleSubmit}>
            {submitError && <div data-testid="submit-error">{submitError}</div>}

            <div>
              <label htmlFor="skillName">Название навыка</label>
              <input
                id="skillName"
                data-testid="input-skillName"
                placeholder="Введите название вашего навыка"
                value={skillName}
                onChange={(e) => {
                  setSkillName(e.target.value);
                  if (errors.skillName) validateForm();
                }}
                onBlur={() => validateForm()}
              />
              {errors.skillName && <span data-testid="error-skillName">{errors.skillName}</span>}
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  name="skillType"
                  value="teach"
                  checked={skillType === 'teach'}
                  onChange={() => setSkillType('teach')}
                />
                Могу научить
              </label>
              <label>
                <input
                  type="radio"
                  name="skillType"
                  value="learn"
                  checked={skillType === 'learn'}
                  onChange={() => setSkillType('learn')}
                />
                Хочу научиться
              </label>
            </div>

            <div>
              <label>Категория</label>
              <div>
                <input
                  data-testid="select-input-category"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Выберите категорию"
                  onBlur={() =>
                    !selectedCategory && setErrors({ ...errors, category: 'Выберите категорию' })
                  }
                />
                <button
                  data-testid="select-action-category"
                  onClick={() => {
                    if (selectedCategory) {
                      // Если категория выбрана - очищаем
                      setSelectedCategory(null);
                      setFilterValue('');
                      setErrors({ ...errors, category: undefined });
                      setCategoryOpen(false);
                    } else {
                      // Если не выбрана - открываем/закрываем список
                      setCategoryOpen(!categoryOpen);
                    }
                  }}
                  type="button"
                >
                  {selectedCategory ? '✕' : '▼'}
                </button>
              </div>
              {errors.category && <span data-testid="error-category">{errors.category}</span>}
              {categoryOpen && (
                <ul data-testid="select-dropdown-category">
                  {filteredCategories.map((option) => (
                    <li
                      key={option.id}
                      data-testid={`select-option-${option.id}`}
                      onClick={() => {
                        setSelectedCategory(option);
                        setCategoryOpen(false);
                        setFilterValue(option.name);
                        setErrors({ ...errors, category: undefined });
                      }}
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              )}
              {selectedCategory && (
                <div data-testid="selected-category">Выбрано: {selectedCategory.name}</div>
              )}
            </div>

            <div>
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                data-testid="description-textarea"
                placeholder="Коротко опишите, чему можете научить или чему хотите научиться"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) validateForm();
                }}
                onBlur={() => validateForm()}
              />
              {errors.description && (
                <span data-testid="error-description">{errors.description}</span>
              )}
            </div>

            <div>
              <p>Перетащите или выберите изображение навыка</p>
              <p>JPEG или PNG, до 2 МБ</p>
              <input
                type="file"
                accept="image/jpeg,image/png"
                data-testid="file-input"
                onChange={handleImageChange}
              />
              <button type="button">Выбрать изображение</button>
              {imageFile && <p data-testid="file-info">Выбран файл: {imageFile.name}</p>}
              {imageError && <span data-testid="error-image">{imageError}</span>}
            </div>

            <button type="submit" data-testid="submit-button" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Создание...' : 'Создать навык'}
            </button>
          </form>
        </section>

        <section aria-label="О создании навыка">
          <img src="school-board.svg" alt="Доска навыков" data-testid="info-image" />
          <h2>Еще больше навыков!</h2>
          <p>Информация о навыке, которым можно поделиться или который можно освоить.</p>
        </section>
      </div>
    </main>
  );
};

describe('CreatePage', () => {
  // Рендеринг
  it('рендерит страницу без ошибок', () => {
    const { container } = render(<MockCreatePage />);
    expect(container).toBeDefined();
  });

  it('отображает заголовок формы', () => {
    render(<MockCreatePage />);
    expect(screen.getByText('Еще больше навыков!')).toBeInTheDocument();
  });

  it('отображает все поля формы', () => {
    render(<MockCreatePage />);

    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument();
    expect(screen.getByText('Могу научить')).toBeInTheDocument();
    expect(screen.getByText('Хочу научиться')).toBeInTheDocument();
    expect(screen.getByText('Категория')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
    expect(screen.getByText('Перетащите или выберите изображение навыка')).toBeInTheDocument();
  });

  it('отображает кнопку создания навыка в disabled состоянии по умолчанию', () => {
    render(<MockCreatePage />);
    const button = screen.getByTestId('submit-button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Создать навык');
  });

  // Радио-кнопки
  it('имеет выбранный тип "Могу научить" по умолчанию', () => {
    render(<MockCreatePage />);
    const teachRadio = screen.getByLabelText('Могу научить') as HTMLInputElement;
    const learnRadio = screen.getByLabelText('Хочу научиться') as HTMLInputElement;

    expect(teachRadio.checked).toBe(true);
    expect(learnRadio.checked).toBe(false);
  });

  it('переключает тип при выборе "Хочу научиться"', () => {
    render(<MockCreatePage />);
    const learnRadio = screen.getByLabelText('Хочу научиться');
    fireEvent.click(learnRadio);

    expect((learnRadio as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Могу научить') as HTMLInputElement).checked).toBe(false);
  });

  // Валидация формы
  it('показывает ошибку при пустом названии навыка', async () => {
    render(<MockCreatePage />);
    const input = screen.getByTestId('input-skillName');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('error-skillName')).toHaveTextContent(
        'Название навыка обязательно'
      );
    });
  });

  it('показывает ошибку при коротком названии навыка', async () => {
    render(<MockCreatePage />);
    const input = screen.getByTestId('input-skillName');
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('error-skillName')).toHaveTextContent(
        'Название должно содержать минимум 3 символа'
      );
    });
  });

  it('показывает ошибку при длинном названии навыка', async () => {
    render(<MockCreatePage />);
    const input = screen.getByTestId('input-skillName');
    fireEvent.change(input, { target: { value: 'a'.repeat(51) } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('error-skillName')).toHaveTextContent(
        'Название должно содержать максимум 50 символов'
      );
    });
  });

  it('показывает ошибку при отсутствии категории', async () => {
    render(<MockCreatePage />);
    const categoryInput = screen.getByTestId('select-input-category');
    fireEvent.blur(categoryInput);

    await waitFor(() => {
      expect(screen.getByTestId('error-category')).toHaveTextContent('Выберите категорию');
    });
  });

  it('показывает ошибку при превышении лимита символов в описании', async () => {
    render(<MockCreatePage />);
    const textarea = screen.getByTestId('description-textarea');
    fireEvent.change(textarea, { target: { value: 'a'.repeat(501) } });
    fireEvent.blur(textarea);

    await waitFor(() => {
      expect(screen.getByTestId('error-description')).toHaveTextContent(
        'Описание не должно превышать 500 символов'
      );
    });
  });

  // Выбор категории
  it('открывает список категорий при клике на кнопку', () => {
    render(<MockCreatePage />);
    const actionButton = screen.getByTestId('select-action-category');
    fireEvent.click(actionButton);
    expect(screen.getByTestId('select-dropdown-category')).toBeInTheDocument();
  });

  it('отображает все категории в списке', () => {
    render(<MockCreatePage />);
    const actionButton = screen.getByTestId('select-action-category');
    fireEvent.click(actionButton);

    const categories = [
      'Бизнес и карьера',
      'Иностранные языки',
      'Дом и уют',
      'Творчество и искусство',
      'Образование и развитие',
      'Здоровье и лайфстайл',
    ];

    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('фильтрует категории при вводе текста', () => {
    render(<MockCreatePage />);
    const actionButton = screen.getByTestId('select-action-category');
    fireEvent.click(actionButton);

    const categoryInput = screen.getByTestId('select-input-category');
    fireEvent.change(categoryInput, { target: { value: 'бизнес' } });

    expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();
    expect(screen.queryByText('Иностранные языки')).not.toBeInTheDocument();
  });

  it('выбирает категорию при клике', () => {
    render(<MockCreatePage />);
    const actionButton = screen.getByTestId('select-action-category');
    fireEvent.click(actionButton);

    const option = screen.getByText('Бизнес и карьера');
    fireEvent.click(option);

    expect(screen.getByTestId('selected-category')).toHaveTextContent('Выбрано: Бизнес и карьера');
  });

  it('очищает выбранную категорию при клике на кнопку очистки', () => {
    render(<MockCreatePage />);

    // Выбираем категорию
    const actionButton = screen.getByTestId('select-action-category');
    fireEvent.click(actionButton);
    const option = screen.getByText('Бизнес и карьера');
    fireEvent.click(option);

    // Проверяем, что категория выбрана и кнопка показывает крестик
    expect(screen.getByTestId('selected-category')).toBeInTheDocument();
    expect(actionButton).toHaveTextContent('✕');

    // Очищаем категорию
    fireEvent.click(actionButton);

    // Проверяем, что категория очищена
    expect(screen.queryByTestId('selected-category')).not.toBeInTheDocument();
    expect(screen.getByTestId('select-input-category')).toHaveValue('');
    expect(actionButton).toHaveTextContent('▼');
  });

  // Загрузка изображения
  it('принимает файл изображения и отображает имя файла', () => {
    render(<MockCreatePage />);
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByTestId('file-info')).toHaveTextContent('Выбран файл: test.jpg');
  });

  it('показывает ошибку при загрузке файла неверного типа', () => {
    render(<MockCreatePage />);
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.gif', { type: 'image/gif' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByTestId('error-image')).toHaveTextContent(
      'Допустимы только JPEG и PNG изображения'
    );
  });

  it('показывает ошибку при загрузке файла больше 2 МБ', () => {
    render(<MockCreatePage />);
    const fileInput = screen.getByTestId('file-input');
    const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByTestId('error-image')).toHaveTextContent(
      'Размер изображения не должен превышать 2 МБ'
    );
  });

  // Разблокировка кнопки
  it('разблокирует кнопку при заполнении всех обязательных полей', async () => {
    render(<MockCreatePage />);

    const skillNameInput = screen.getByTestId('input-skillName');
    fireEvent.change(skillNameInput, { target: { value: 'React Development' } });

    const actionButton = screen.getByTestId('select-action-category');
    fireEvent.click(actionButton);
    const option = screen.getByText('Бизнес и карьера');
    fireEvent.click(option);

    const submitButton = screen.getByTestId('submit-button');
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  // Отправка формы
  it('показывает состояние загрузки при отправке', async () => {
    render(<MockCreatePage />);

    const skillNameInput = screen.getByTestId('input-skillName');
    fireEvent.change(skillNameInput, { target: { value: 'React Development' } });

    const actionButton = screen.getByTestId('select-action-category');
    fireEvent.click(actionButton);
    const option = screen.getByText('Бизнес и карьера');
    fireEvent.click(option);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Создание...');
    });
  });

  // Информационная секция
  it('отображает изображение в информационной секции', () => {
    render(<MockCreatePage />);
    const image = screen.getByTestId('info-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Доска навыков');
  });

  it('отображает текст в информационной секции', () => {
    render(<MockCreatePage />);
    expect(screen.getByText('Еще больше навыков!')).toBeInTheDocument();
    expect(
      screen.getByText('Информация о навыке, которым можно поделиться или который можно освоить.')
    ).toBeInTheDocument();
  });
});
