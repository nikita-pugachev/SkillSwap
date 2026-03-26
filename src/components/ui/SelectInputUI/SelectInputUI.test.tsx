import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SelectInputUI } from './SelectInputUI';
import type { TSelectOption } from '@/utils/types';

jest.mock('./SelectInputUI.module.scss', () => ({
  __esModule: true,
  default: {
    selectBox: 'selectBox',
    labelInput: 'labelInput',
    selectFrame: 'selectFrame',
    selectFrameOpen: 'selectFrameOpen',
    isError: 'isError',
    inputArea: 'inputArea',
    inputAreaOpen: 'inputAreaOpen',
    actionButton: 'actionButton',
    chevronButton: 'chevronButton',
    dropdown: 'dropdown',
    option: 'option',
    optionSelected: 'optionSelected',
    empty: 'empty',
    errorInput: 'errorInput',
    hintInput: 'hintInput',
  },
}));

jest.mock('../InputUI/InputUI', () => {
  const ReactActual = jest.requireActual('react') as typeof React;

  const MockInputUI = ReactActual.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
  >((props, ref) => <input ref={ref} {...props} />);

  MockInputUI.displayName = 'MockInputUI';

  return {
    __esModule: true,
    InputUI: MockInputUI,
  };
});

jest.mock('../IconButton/IconButton', () => ({
  __esModule: true,
  IconButton: ({
    ariaLabel,
    onClick,
    className,
    type,
  }: {
    ariaLabel: string;
    onClick: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button type={type ?? 'button'} aria-label={ariaLabel} onClick={onClick} className={className}>
      clear
    </button>
  ),
}));

jest.mock('../Icons/ChevronIcon', () => ({
  __esModule: true,
  ChevronIcon: ({ isOpen }: { isOpen: boolean }) => (
    <span data-testid="chevron-icon">{isOpen ? 'open' : 'closed'}</span>
  ),
}));

describe('SelectInputUI', () => {
  const ClearIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => <svg />;
  const options: TSelectOption[] = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Санкт-Петербург' },
  ];

  const createProps = () => ({
    id: 'city',
    label: 'Город',
    error: '',
    hint: 'Выберите город',
    placeholder: 'Выберите значение',
    disabled: false,
    noOptionsText: 'Ничего не найдено',
    isOpen: false,
    rootRef: { current: null } as React.RefObject<HTMLDivElement | null>,
    inputRef: { current: null } as React.RefObject<HTMLInputElement | null>,
    inputValue: '',
    selectedOption: null as TSelectOption | null,
    filteredOptions: options,
    activeOptionIndex: -1,
    clearIcon: ClearIcon,
    shouldShowClear: false,
    actionAriaLabel: 'Открыть список',
    handleInputChange: jest.fn(),
    handleInputFocus: jest.fn(),
    handleInputKeyDown: jest.fn(),
    handleActionClick: jest.fn(),
    handleSelectOption: jest.fn(),
  });

  it('рендерит label, input и hint', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    expect(screen.getByText('Город')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Выберите значение')).toBeInTheDocument();
    expect(screen.getByText('Выберите город')).toBeInTheDocument();
  });

  it('вызывает handleInputChange при вводе текста', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Мос' },
    });

    expect(props.handleInputChange).toHaveBeenCalledTimes(1);
  });

  it('вызывает handleInputFocus при фокусе на input', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    fireEvent.focus(screen.getByRole('combobox'));

    expect(props.handleInputFocus).toHaveBeenCalledTimes(1);
  });

  it('вызывает handleInputKeyDown при нажатии клавиши', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });

    expect(props.handleInputKeyDown).toHaveBeenCalledTimes(1);
  });

  it('рендерит кнопку chevron и вызывает handleActionClick по клику', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    const actionButton = screen.getByRole('button', { name: 'Открыть список' });
    fireEvent.click(actionButton);

    expect(props.handleActionClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  it('рендерит clear-кнопку вместо chevron, если shouldShowClear = true', () => {
    const props = createProps();
    props.shouldShowClear = true;
    props.actionAriaLabel = 'Очистить';

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('button', { name: 'Очистить' })).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();
  });

  it('вызывает handleActionClick по клику на clear-кнопку', () => {
    const props = createProps();
    props.shouldShowClear = true;
    props.actionAriaLabel = 'Очистить';

    render(<SelectInputUI {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    expect(props.handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('показывает dropdown с опциями, когда isOpen = true', () => {
    const props = createProps();
    props.isOpen = true;

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Москва' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Санкт-Петербург' })).toBeInTheDocument();
  });

  it('вызывает handleSelectOption при выборе опции', () => {
    const props = createProps();
    props.isOpen = true;

    render(<SelectInputUI {...props} />);

    fireEvent.click(screen.getByRole('option', { name: 'Москва' }));

    expect(props.handleSelectOption).toHaveBeenCalledTimes(1);
    expect(props.handleSelectOption).toHaveBeenCalledWith(options[0]);
  });

  it('ставит aria-selected для активной опции', () => {
    const props = createProps();
    props.isOpen = true;
    props.selectedOption = options[1];
    props.activeOptionIndex = 1;

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('option', { name: 'Санкт-Петербург' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('option', { name: 'Москва' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('проставляет aria-activedescendant для активной опции, когда список открыт', () => {
    const props = createProps();
    props.isOpen = true;
    props.activeOptionIndex = 0;

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'city-option-1');
  });

  it('не проставляет aria-activedescendant, когда активной опции нет', () => {
    const props = createProps();
    props.isOpen = true;
    props.activeOptionIndex = -1;

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
  });

  it('показывает noOptionsText, если список пуст', () => {
    const props = createProps();
    props.isOpen = true;
    props.filteredOptions = [];

    render(<SelectInputUI {...props} />);

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('показывает error вместо hint, если передан error', () => {
    const props = createProps();
    props.error = 'Обязательное поле';

    render(<SelectInputUI {...props} />);

    expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
    expect(screen.queryByText('Выберите город')).not.toBeInTheDocument();
  });

  it('пробрасывает aria-describedby на hint, если ошибки нет', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'city-hint');
  });

  it('пробрасывает aria-describedby на error, если есть ошибка', () => {
    const props = createProps();
    props.error = 'Обязательное поле';

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'city-error');
  });

  it('пробрасывает disabled в input и chevron-кнопку', () => {
    const props = createProps();
    props.disabled = true;

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeDisabled();
  });
});
