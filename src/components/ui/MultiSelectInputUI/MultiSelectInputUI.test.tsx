import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { MultiSelectInputUI } from './MultiSelectInputUI';

type TProps = React.ComponentProps<typeof MultiSelectInputUI>;
type TOption = TProps['filteredOptions'][number];

const optionOne: TOption = {
  id: 1,
  title: 'React',
  categoryId: 10,
  categoryTitle: 'Frontend',
};

const optionTwo: TOption = {
  id: 2,
  title: 'TypeScript',
  categoryId: 10,
  categoryTitle: 'Frontend',
};

const createProps = (overrides: Partial<TProps> = {}): TProps => ({
  id: 'skills',
  label: 'Навыки',
  error: undefined,
  hint: 'Можно выбрать несколько вариантов',
  placeholder: 'Выберите категорию',
  disabled: false,
  noOptionsText: 'Ничего не найдено',

  isOpen: false,
  rootRef: React.createRef<HTMLDivElement>(),
  inputRef: React.createRef<HTMLInputElement>(),
  inputValue: '',
  selectedOptions: [],
  filteredOptions: [optionOne, optionTwo],
  selectedIds: new Set<number>(),
  activeOptionIndex: -1,

  clearIconSrc: '/icons/clear.svg',
  shouldShowClear: false,
  actionAriaLabel: 'Открыть список',

  handleInputChange: jest.fn(),
  handleInputFocus: jest.fn(),
  handleInputKeyDown: jest.fn(),
  handleActionClick: jest.fn(),
  handleToggleOption: jest.fn(),

  ...overrides,
});

describe('MultiSelectInputUI', () => {
  it('рендерит label, hint и закрытый combobox с корректными aria-атрибутами', () => {
    render(<MultiSelectInputUI {...createProps()} />);

    const combobox = screen.getByRole('combobox', { name: 'Навыки' });

    expect(screen.getByText('Навыки')).toBeInTheDocument();
    expect(screen.getByText('Можно выбрать несколько вариантов')).toBeInTheDocument();

    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveAttribute('aria-controls', 'skills-listbox');
    expect(combobox).toHaveAttribute('aria-describedby', 'skills-hint');
    expect(combobox).toHaveAttribute('placeholder', 'Выберите категорию');
    expect(combobox).toHaveAttribute('readonly');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('при открытии показывает список опций и выставляет active descendant', () => {
    render(
      <MultiSelectInputUI
        {...createProps({
          isOpen: true,
          selectedOptions: [optionTwo],
          selectedIds: new Set<number>([2]),
          activeOptionIndex: 1,
        })}
      />
    );

    const combobox = screen.getByRole('combobox', { name: 'Навыки' });
    const listbox = screen.getByRole('listbox', { name: 'Навыки' });
    const options = within(listbox).getAllByRole('option');

    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(combobox).toHaveAttribute('aria-activedescendant', 'skills-option-2');
    expect(combobox).not.toHaveAttribute('readonly');

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('вызывает обработчики input и кнопки действия', () => {
    const props = createProps({
      isOpen: true,
    });

    render(<MultiSelectInputUI {...props} />);

    const combobox = screen.getByRole('combobox', { name: 'Навыки' });
    const actionButton = screen.getByRole('button', { name: 'Открыть список' });

    fireEvent.focus(combobox);
    fireEvent.change(combobox, { target: { value: 'Re' } });
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.click(actionButton);

    expect(props.handleInputFocus).toHaveBeenCalledTimes(1);
    expect(props.handleInputChange).toHaveBeenCalledTimes(1);
    expect(props.handleInputKeyDown).toHaveBeenCalledTimes(1);
    expect(props.handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('вызывает handleToggleOption при выборе чекбокса', () => {
    const props = createProps({
      isOpen: true,
    });

    render(<MultiSelectInputUI {...props} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'React' }));

    expect(props.handleToggleOption).toHaveBeenCalledTimes(1);
    expect(props.handleToggleOption).toHaveBeenCalledWith(optionOne);
  });

  it('показывает текст пустого списка, если filteredOptions пустой', () => {
    render(
      <MultiSelectInputUI
        {...createProps({
          isOpen: true,
          filteredOptions: [],
          noOptionsText: 'Совпадений нет',
        })}
      />
    );

    expect(screen.getByRole('listbox', { name: 'Навыки' })).toBeInTheDocument();
    expect(screen.getByText('Совпадений нет')).toBeInTheDocument();
  });

  it('показывает error вместо hint и связывает input с error через aria-describedby', () => {
    render(
      <MultiSelectInputUI
        {...createProps({
          error: 'Поле обязательно',
          hint: 'Этот текст не должен показываться',
        })}
      />
    );

    const combobox = screen.getByRole('combobox', { name: 'Навыки' });

    expect(screen.getByText('Поле обязательно')).toBeInTheDocument();
    expect(screen.queryByText('Этот текст не должен показываться')).not.toBeInTheDocument();

    expect(combobox).toHaveAttribute('aria-invalid', 'true');
    expect(combobox).toHaveAttribute('aria-describedby', 'skills-error');
  });

  it('рендерит clear action button, если shouldShowClear = true', () => {
    const props = createProps({
      shouldShowClear: true,
      actionAriaLabel: 'Очистить выбор',
    });

    render(<MultiSelectInputUI {...props} />);

    const clearButton = screen.getByRole('button', { name: 'Очистить выбор' });

    fireEvent.click(clearButton);

    expect(clearButton).toBeInTheDocument();
    expect(props.handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('делает input и action button disabled, если disabled = true', () => {
    render(
      <MultiSelectInputUI
        {...createProps({
          disabled: true,
          actionAriaLabel: 'Открыть список',
        })}
      />
    );

    expect(screen.getByRole('combobox', { name: 'Навыки' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeDisabled();
  });
});
