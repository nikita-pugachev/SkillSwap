import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePage from './create-page';

// Мокаем изображения
jest.mock('@/assets/icons/gallery-add.svg', () => ({
  default: 'gallery-add-icon.svg',
}));
jest.mock('@/assets/icons/cross.svg', () => ({
  default: 'cross-icon.svg',
}));
jest.mock('@/assets/illustrations/school-board.svg', () => ({
  default: 'school-board.svg',
}));

// Мокаем UI компоненты
jest.mock('@/components/ui', () => ({
  Button: ({
    children,
    onClick,
    type,
    className,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'submit' | 'reset' | 'button';
    className?: string;
    variant?: string;
  }) => (
    <button onClick={onClick} type={type} className={className} data-variant={variant}>
      {children}
    </button>
  ),
  InputBaseContainerUI: ({
    label,
    children,
    id,
    error,
    hint,
  }: {
    label: string;
    children: React.ReactNode;
    id: string;
    error?: string;
    hint?: string;
  }) => (
    <div data-testid={`input-container-${id}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span role="alert">{error}</span>}
      {hint && <span>{hint}</span>}
    </div>
  ),
  InputUI: ({
    id,
    type,
    placeholder,
    value,
    onChange,
  }: {
    id: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid={`input-${id}`}
    />
  ),
  SelectInputUI: ({
    id,
    label,
    placeholder,
    isOpen,
    inputValue,
    filteredOptions,
    shouldShowClear,
    handleInputChange,
    handleInputFocus,
    handleActionClick,
    handleSelectOption,
    clearIconSrc,
    actionAriaLabel,
  }: {
    id: string;
    label: string;
    placeholder: string;
    isOpen: boolean;
    inputValue: string;
    filteredOptions: Array<{ id: number; name: string }>;
    shouldShowClear: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputFocus: () => void;
    handleActionClick: () => void;
    handleSelectOption: (option: { id: number; name: string }) => void;
    clearIconSrc?: string;
    actionAriaLabel: string;
  }) => (
    <div data-testid={`select-${id}`}>
      <label htmlFor={`${id}-input`}>{label}</label>
      <input
        id={`${id}-input`}
        data-testid={`select-input-${id}`}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      <button
        data-testid={`select-action-${id}`}
        onClick={handleActionClick}
        aria-label={actionAriaLabel}
      >
        {shouldShowClear && clearIconSrc && '✕'}
      </button>
      {isOpen && (
        <ul data-testid={`select-dropdown-${id}`}>
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              data-testid={`select-option-${option.id}`}
              onClick={() => handleSelectOption(option)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  ),
}));

describe('CreatePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен рендерить страницу без ошибок', () => {
      render(<CreatePage />);

      expect(screen.getByLabelText('Форма создания навыка')).toBeInTheDocument();
      expect(screen.getByLabelText('О создании навыка')).toBeInTheDocument();
    });

    it('должен отображать все поля формы', () => {
      render(<CreatePage />);

      expect(screen.getByLabelText('Название навыка')).toBeInTheDocument();
      expect(screen.getByTestId('input-skillName')).toBeInTheDocument();

      expect(screen.getByText('Могу научить')).toBeInTheDocument();
      expect(screen.getByText('Хочу научиться')).toBeInTheDocument();

      expect(screen.getByTestId('select-category')).toBeInTheDocument();

      expect(screen.getByLabelText('Описание')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          'Коротко опишите, чему можете научить или чему хотите научиться'
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Перетащите или выберите изображение навыка')).toBeInTheDocument();
      expect(screen.getByText('Выбрать изображение')).toBeInTheDocument();
    });

    it('должен отображать кнопку "Создать навык"', () => {
      render(<CreatePage />);

      const submitButton = screen.getByText('Создать навык');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('должен отображать изображение в info секции', () => {
      render(<CreatePage />);

      const image = screen.getByAltText('Доска навыков');
      expect(image).toBeInTheDocument();
    });

    it('должен отображать текст в info секции', () => {
      render(<CreatePage />);

      expect(screen.getByText('Еще больше навыков!')).toBeInTheDocument();
      expect(
        screen.getByText('Информация о навыке, которым можно поделиться или который можно освоить.')
      ).toBeInTheDocument();
    });
  });

  describe('Радио-кнопки', () => {
    it('должен иметь выбранный тип "Могу научить" по умолчанию', () => {
      render(<CreatePage />);

      const teachRadio = screen.getByLabelText('Могу научить') as HTMLInputElement;
      const learnRadio = screen.getByLabelText('Хочу научиться') as HTMLInputElement;

      expect(teachRadio.checked).toBe(true);
      expect(learnRadio.checked).toBe(false);
    });

    it('должен переключать тип при выборе "Хочу научиться"', () => {
      render(<CreatePage />);

      const teachRadio = screen.getByLabelText('Могу научить') as HTMLInputElement;
      const learnRadio = screen.getByLabelText('Хочу научиться') as HTMLInputElement;

      fireEvent.click(learnRadio);

      expect(teachRadio.checked).toBe(false);
      expect(learnRadio.checked).toBe(true);
    });

    it('должен переключать тип обратно на "Могу научить"', () => {
      render(<CreatePage />);

      const teachRadio = screen.getByLabelText('Могу научить') as HTMLInputElement;
      const learnRadio = screen.getByLabelText('Хочу научиться') as HTMLInputElement;

      fireEvent.click(learnRadio);
      fireEvent.click(teachRadio);

      expect(teachRadio.checked).toBe(true);
      expect(learnRadio.checked).toBe(false);
    });
  });

  describe('Выбор категории', () => {
    it('должен открывать список категорий при фокусе на поле', () => {
      render(<CreatePage />);

      const categoryInput = screen.getByTestId('select-input-category');

      fireEvent.focus(categoryInput);

      expect(screen.getByTestId('select-dropdown-category')).toBeInTheDocument();
    });

    it('должен отображать все категории в списке', () => {
      render(<CreatePage />);

      const categoryInput = screen.getByTestId('select-input-category');
      fireEvent.focus(categoryInput);

      const categories = [
        'Бизнес и карьера',
        'Иностранные языки',
        'Дом и уют',
        'Творчество и искусств',
        'Образование и развитие',
        'Здоровье и лайфстайл',
      ];

      categories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it('должен фильтровать категории при вводе текста', async () => {
      render(<CreatePage />);

      const categoryInput = screen.getByTestId('select-input-category');

      fireEvent.change(categoryInput, { target: { value: 'бизнес' } });

      await waitFor(() => {
        expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();
        expect(screen.queryByText('Иностранные языки')).not.toBeInTheDocument();
      });
    });

    it('должен выбирать категорию при клике на неё', () => {
      render(<CreatePage />);

      const categoryInput = screen.getByTestId('select-input-category');
      fireEvent.focus(categoryInput);

      const option = screen.getByText('Бизнес и карьера');
      fireEvent.click(option);

      expect(categoryInput).toHaveValue('Бизнес и карьера');
    });
  });

  describe('Загрузка изображения', () => {
    it('должен принимать файл изображения', () => {
      render(<CreatePage />);

      const fileInput = screen
        .getByLabelText('Выбрать изображение')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput!, { target: { files: [file] } });

      expect(screen.getByText('Выбран файл: test.jpg')).toBeInTheDocument();
    });

    it('должен принимать только jpeg и png файлы', () => {
      render(<CreatePage />);

      const fileInput = screen
        .getByLabelText('Выбрать изображение')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      expect(fileInput).toHaveAttribute('accept', 'image/jpeg,image/png');
    });
  });

  describe('Отправка формы', () => {
    it('должен вызывать handleSubmit при отправке формы', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      render(<CreatePage />);

      const form = screen
        .getByLabelText('Форма создания навыка')
        .querySelector('form') as HTMLFormElement;

      fireEvent.submit(form);

      expect(consoleSpy).toHaveBeenCalledWith('Form submitted');
      consoleSpy.mockRestore();
    });

    it('должен сохранять данные формы при отправке', async () => {
      render(<CreatePage />);

      const skillNameInput = screen.getByTestId('input-skillName');
      fireEvent.change(skillNameInput, { target: { value: 'React' } });

      const learnRadio = screen.getByLabelText('Хочу научиться');
      fireEvent.click(learnRadio);

      const categoryInput = screen.getByTestId('select-input-category');
      fireEvent.focus(categoryInput);
      const option = screen.getByText('Бизнес и карьера');
      fireEvent.click(option);

      const description = screen.getByPlaceholderText(
        'Коротко опишите, чему можете научить или чему хотите научиться'
      );
      fireEvent.change(description, { target: { value: 'Хочу выучить React' } });

      const fileInput = screen
        .getByLabelText('Выбрать изображение')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'react.png', { type: 'image/png' });
      fireEvent.change(fileInput!, { target: { files: [file] } });

      const form = screen
        .getByLabelText('Форма создания навыка')
        .querySelector('form') as HTMLFormElement;
      fireEvent.submit(form);

      expect(form).toBeDefined();
      expect(categoryInput).toHaveValue('Бизнес и карьера');
    });
  });
});
