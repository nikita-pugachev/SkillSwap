import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryDropdown } from './CategoryDropdown';

test('открывает и закрывает dropdown', () => {
  render(<CategoryDropdown />);

  const button = screen.getByRole('button', { name: /все навыки/i });

  // изначально меню закрыто
  expect(screen.queryByText('Бизнес и карьера')).not.toBeInTheDocument();

  // открываем
  fireEvent.click(button);
  // проверяем, что хотя бы один элемент категории появился
  expect(screen.getByText('Бизнес и карьера')).toBeInTheDocument();

  // закрываем кликом вне
  fireEvent.mouseDown(document);
  expect(screen.queryByText('Бизнес и карьера')).not.toBeInTheDocument();
});
