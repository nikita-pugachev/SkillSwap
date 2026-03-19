import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogLoading } from './CatalogLoading';
import { CatalogError } from './CatalogError';
import { CatalogEmpty } from './CatalogEmpty';

describe('Catalog states', () => {
  it('CatalogLoading renders spinner and text', () => {
    render(<CatalogLoading />);
    expect(screen.getByText('Загружаем каталог...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('CatalogError displays error message and calls onRetry', () => {
    const onRetry = jest.fn();
    render(<CatalogError message="Тестовая ошибка" onRetry={onRetry} />);
    expect(screen.getByText('Произошла ошибка: Тестовая ошибка')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /попробовать снова/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('CatalogEmpty displays empty message and calls onResetFilters', () => {
    const onReset = jest.fn();
    render(<CatalogEmpty onResetFilters={onReset} />);
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /сбросить фильтры/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
