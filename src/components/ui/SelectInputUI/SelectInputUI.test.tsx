import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SelectInputUI } from './SelectInputUI';
import type { TSelectOption } from '@/components/SelectInput/SelectInput';

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

jest.mock('../InputUI/InputUI', () => ({
  __esModule: true,
  InputUI: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

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
  const options: TSelectOption[] = [
    { id: 1, value: 'Москва' },
    { id: 2, value: 'Санкт-Петербург' },
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
    clearIconSrc: '/icons/clear.svg',
    shouldShowClear: false,
    actionAriaLabel: 'Открыть список',
    handleInputChange: jest.fn(),
    handleInputFocus: jest.fn(),
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

  it('ставит aria-selected для выбранной опции', () => {
    const props = createProps();
    props.isOpen = true;
    props.selectedOption = options[1];

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

  it('пробрасывает disabled в input и кнопку', () => {
    const props = createProps();
    props.disabled = true;

    render(<SelectInputUI {...props} />);

    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeDisabled();
  });
});
