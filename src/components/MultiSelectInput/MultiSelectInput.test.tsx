import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MultiSelectInput, type TMultiSelectInputProps } from './MultiSelectInput';
import type { TSubcategoryOption } from '@/utils/types';

type TMockedMultiSelectInputUIProps = {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  noOptionsText?: string;
  isOpen: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  selectedOptions: TSubcategoryOption[];
  filteredOptions: TSubcategoryOption[];
  selectedIds: Set<number>;
  activeOptionIndex: number;
  clearIconSrc: string;
  shouldShowClear: boolean;
  actionAriaLabel: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleActionClick: () => void;
  handleToggleOption: (option: TSubcategoryOption) => void;
};

jest.mock('../../assets/icons/cross.svg', () => 'cross.svg');

jest.mock('../ui', () => ({
  MultiSelectInputUI: (props: TMockedMultiSelectInputUIProps) => {
    const {
      id,
      label,
      placeholder,
      disabled,
      noOptionsText,
      isOpen,
      rootRef,
      inputRef,
      inputValue,
      filteredOptions,
      selectedIds,
      activeOptionIndex,
      actionAriaLabel,
      shouldShowClear,
      handleInputChange,
      handleInputFocus,
      handleInputKeyDown,
      handleActionClick,
      handleToggleOption,
    } = props;

    return (
      <div ref={rootRef} data-testid="multi-select-root">
        {label ? <label htmlFor={id}>{label}</label> : null}

        <input
          id={id}
          ref={inputRef}
          aria-label={label ?? id}
          placeholder={placeholder}
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
        />

        <button type="button" aria-label={actionAriaLabel} onClick={handleActionClick}>
          {shouldShowClear ? 'action-clear' : 'action-toggle'}
        </button>

        {isOpen ? (
          filteredOptions.length > 0 ? (
            <ul aria-label="options">
              {filteredOptions.map((option, index) => (
                <li key={option.id}>
                  <button
                    type="button"
                    aria-label={`option-${option.id}`}
                    data-active={index === activeOptionIndex}
                    data-selected={selectedIds.has(option.id)}
                    onClick={() => handleToggleOption(option)}
                  >
                    {option.title} / {option.categoryTitle}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>{noOptionsText}</div>
          )
        ) : null}
      </div>
    );
  },
}));

const OPTIONS: TSubcategoryOption[] = [
  { id: 1, title: 'Ноутбуки', categoryId: 10, categoryTitle: 'Электроника' },
  { id: 2, title: 'Смартфоны', categoryId: 10, categoryTitle: 'Электроника' },
  { id: 3, title: 'Стулья', categoryId: 20, categoryTitle: 'Мебель' },
];

const setup = (props: Partial<TMultiSelectInputProps> = {}) => {
  const onChange = jest.fn<void, [TSubcategoryOption[]]>();

  const view = render(
    <MultiSelectInput
      id="subcategory"
      label="Подкатегории"
      options={OPTIONS}
      onChange={onChange}
      {...props}
    />
  );

  const input = screen.getByLabelText('Подкатегории');

  return {
    ...view,
    input,
    onChange,
  };
};

beforeAll(() => {
  jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback: Parameters<typeof window.requestAnimationFrame>[0]): number => {
      callback(0);
      return 0;
    });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('MultiSelectInput', () => {
  it('показывает выбранные значения из defaultValue, когда список закрыт', () => {
    setup({
      defaultValue: [OPTIONS[0], OPTIONS[2]],
    });

    expect(screen.getByLabelText('Подкатегории')).toHaveValue('Ноутбуки, Стулья');
  });

  it('не обновляет selectedOptions при изменении defaultValue после первого рендера', () => {
    const { rerender } = render(
      <MultiSelectInput
        id="subcategory"
        label="Подкатегории"
        options={OPTIONS}
        defaultValue={[OPTIONS[0]]}
      />
    );

    expect(screen.getByLabelText('Подкатегории')).toHaveValue('Ноутбуки');

    rerender(
      <MultiSelectInput
        id="subcategory"
        label="Подкатегории"
        options={OPTIONS}
        defaultValue={[OPTIONS[1], OPTIONS[2]]}
      />
    );

    expect(screen.getByLabelText('Подкатегории')).toHaveValue('Ноутбуки');
  });

  it('открывает список по focus и фильтрует по title', () => {
    const { input } = setup();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'смарт' } });

    expect(screen.getByRole('button', { name: 'option-2' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'option-1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'option-3' })).not.toBeInTheDocument();
  });

  it('фильтрует по categoryTitle', () => {
    const { input } = setup();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'мебель' } });

    expect(screen.getByRole('button', { name: 'option-3' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'option-1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'option-2' })).not.toBeInTheDocument();
  });

  it('показывает noOptionsText, если ничего не найдено', () => {
    const { input } = setup({
      noOptionsText: 'Совпадений нет',
    });

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'xyz' } });

    expect(screen.getByText('Совпадений нет')).toBeInTheDocument();
  });

  it('выбирает опцию по клику и вызывает onChange', () => {
    const { input, onChange } = setup();

    fireEvent.focus(input);
    fireEvent.click(screen.getByRole('button', { name: 'option-1' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([OPTIONS[0]]);
    expect(input).toHaveFocus();
  });

  it('снимает выбор с уже выбранной опции и вызывает onChange', () => {
    const { input, onChange } = setup({
      defaultValue: [OPTIONS[0]],
    });

    fireEvent.focus(input);
    fireEvent.click(screen.getByRole('button', { name: 'option-1' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(input).toHaveFocus();
  });

  it('очищает выбранные значения по action-кнопке, когда список закрыт', () => {
    const { onChange } = setup({
      defaultValue: [OPTIONS[0], OPTIONS[1]],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Очистить выбранные значения' }));

    expect(onChange).toHaveBeenCalledWith([]);
    expect(screen.getByLabelText('Подкатегории')).toHaveValue('');
  });

  it('очищает поисковую строку по action-кнопке, когда список открыт', () => {
    const { input } = setup();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'смарт' } });

    expect(input).toHaveValue('смарт');

    fireEvent.click(screen.getByRole('button', { name: 'Очистить поиск' }));

    expect(input).toHaveValue('');
    expect(screen.getByRole('button', { name: 'option-1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-3' })).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('закрывает список по Escape и сбрасывает поиск', () => {
    const { input } = setup();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'смарт' } });

    expect(screen.getByRole('button', { name: 'option-2' })).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByRole('list', { name: 'options' })).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('поддерживает навигацию клавиатурой и выбор по Enter', () => {
    const { input, onChange } = setup();

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith([OPTIONS[0]]);
  });

  it('поддерживает выбор по Space для активной опции', () => {
    const { input, onChange } = setup();

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: ' ' });

    expect(onChange).toHaveBeenCalledWith([OPTIONS[0]]);
  });

  it('ArrowDown открывает список, если он был закрыт', () => {
    const { input } = setup();

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(screen.getByRole('button', { name: 'option-1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-3' })).toBeInTheDocument();
  });

  it('ArrowUp открывает список, если он был закрыт', () => {
    const { input } = setup();

    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(screen.getByRole('button', { name: 'option-1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-3' })).toBeInTheDocument();
  });

  it('закрывает список по клику вне компонента', () => {
    const { input } = setup();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'смарт' } });

    expect(screen.getByRole('button', { name: 'option-2' })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('list', { name: 'options' })).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('не открывается и не реагирует на действия в disabled-состоянии', () => {
    const { input, onChange } = setup({
      disabled: true,
      defaultValue: [OPTIONS[0]],
    });

    fireEvent.focus(input);
    expect(screen.queryByRole('list', { name: 'options' })).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.queryByRole('list', { name: 'options' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Очистить выбранные значения' }));
    expect(onChange).not.toHaveBeenCalled();

    expect(screen.getByLabelText('Подкатегории')).toHaveValue('Ноутбуки');
  });

  it('закрывает список по action-кнопке, когда он открыт и поиск пустой', () => {
    const { input } = setup();

    fireEvent.focus(input);
    expect(screen.getByRole('button', { name: 'Закрыть список' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть список' }));

    expect(screen.queryByRole('list', { name: 'options' })).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('открывает список по action-кнопке, когда он закрыт и нет выбранных значений', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Открыть список' }));

    expect(screen.getByRole('button', { name: 'option-1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'option-3' })).toBeInTheDocument();
  });
});
