import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryDropdown } from './CategoryDropdown';

describe('CategoryDropdown', () => {
  test('открывает и закрывает dropdown', () => {
    render(<CategoryDropdown />);

    const button = screen.getByRole('button', { name: /все навыки/i });

    // Закрытое меню
    expect(screen.queryByText('Бизнес и карьера')).not.toBeInTheDocument();

    // Открываем
    fireEvent.click(button);
    // Проверяем что элемент
    expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();

    // Закрываем кликом вне
    fireEvent.mouseDown(document);
    expect(screen.queryByText('Бизнес и карьера')).not.toBeInTheDocument();
  });

  test('вызывает onCategorySelect с названием категории при клике на категорию', () => {
    const mockOnSelect = jest.fn();
    render(<CategoryDropdown onCategorySelect={mockOnSelect} />);

    // Открываем меню
    const button = screen.getByRole('button', { name: /все навыки/i });
    fireEvent.click(button);

    // Кликаем на кнопку с названием категории
    const categoryButton = screen.getByTestId('category-title-Бизнес и карьера');
    fireEvent.click(categoryButton);

    expect(mockOnSelect).toHaveBeenCalledWith('Бизнес и карьера');
  });

  // Тест на выбор подкатегории
  test('вызывает onCategorySelect с названием подкатегории при клике на подкатегорию', () => {
    const mockOnSelect = jest.fn();
    render(<CategoryDropdown onCategorySelect={mockOnSelect} />);

    // Открываем меню
    const button = screen.getByRole('button', { name: /все навыки/i });
    fireEvent.click(button);

    // Кликаем на подкатегорию "Управление командой" (из категории Бизнес и карьера)
    const subcategoryButton = screen.getByRole('button', { name: /управление командой/i });
    fireEvent.click(subcategoryButton);

    // Проверяем, что callback вызван с правильным значением
    expect(mockOnSelect).toHaveBeenCalledWith('Управление командой');
    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    // Проверяем, что меню закрылось
    expect(screen.queryByText('Бизнес и карьера')).not.toBeInTheDocument();
  });

  // Тест на закрытие по Escape
  test('закрывает dropdown при нажатии Escape', () => {
    render(<CategoryDropdown />);

    // Открываем меню
    const button = screen.getByRole('button', { name: /все навыки/i });
    fireEvent.click(button);
    expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();

    // Нажимаем Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    // Проверяем, что меню закрылось
    expect(screen.queryByText('Бизнес и карьера')).not.toBeInTheDocument();
  });

  // Тест на закрытие по клику вне
  test('закрывает dropdown при клике вне меню', () => {
    render(<CategoryDropdown />);

    // Открываем меню
    const button = screen.getByRole('button', { name: /все навыки/i });
    fireEvent.click(button);
    expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();

    // Кликаем вне меню
    fireEvent.mouseDown(document.body);

    // Проверяем что меню закрылось
    expect(screen.queryByText('Бизнес и карьера')).not.toBeInTheDocument();
  });

  // Проверка что клик в меню не закрывает его
  test('не закрывает dropdown при клике внутри меню', () => {
    render(<CategoryDropdown />);

    // Открываем меню
    const button = screen.getByRole('button', { name: /все навыки/i });
    fireEvent.click(button);

    // Получаем элемент меню
    const menuPanel = screen.getByText('Бизнес и карьера').closest('.menuPanel');

    // Кликаем внутри меню
    if (menuPanel) {
      fireEvent.mouseDown(menuPanel);
    }

    // Проверяем, что меню всё ещё открыто
    expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();
  });
});
