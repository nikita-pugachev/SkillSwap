import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectInputUI } from './SelectInputUI';
import type { TSelectOption } from '@/components/SelectInput/SelectInput';

jest.mock('./SelectInputUI.module.scss', () => ({
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
}));

type MockInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const mockInputUI = React.forwardRef<HTMLInputElement, MockInputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

mockInputUI.displayName = 'MockInputUI';

jest.mock('../InputUI/InputUI', () => ({
  InputUI: mockInputUI,
}));

jest.mock('../IconButton/IconButton', () => ({
  IconButton: ({
    ariaLabel,
    onClick,
    className,
    type,
    iconSrc,
  }: {
    ariaLabel: string;
    onClick: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    iconSrc: string;
  }) => (
    <button
      type={type ?? 'button'}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
      data-icon-src={iconSrc}
    >
      icon-button
    </button>
  ),
}));

jest.mock('../Icons/ChevronIcon', () => ({
  ChevronIcon: ({ isOpen }: { isOpen: boolean }) => (
    <span data-testid="chevron-icon">{isOpen ? 'open' : 'closed'}</span>
  ),
}));

describe('SelectInputUI', () => {
  const options: TSelectOption[] = [
    { id: 1, value: 'Москва' },
    { id: 2, value: 'Санкт-Петербург' },
  ];

  const createProps = () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const inputRef = React.createRef<HTMLInputElement>();

    return {
      id: 'city',
      label: 'Город',
      error: undefined,
      hint: 'Выберите город',
      placeholder: 'Выберите значение',
      disabled: false,
      noOptionsText: 'Ничего не найдено',
      isOpen: false,
      rootRef,
      inputRef,
      inputValue: '',
      selectedOption: null,
      filteredOptions: options,
      clearIconSrc: '/clear.svg',
      shouldShowClear: false,
      actionAriaLabel: 'Открыть список',
      handleInputChange: jest.fn(),
      handleInputFocus: jest.fn(),
      handleActionClick: jest.fn(),
      handleSelectOption: jest.fn(),
    };
  };

  it('рендерит label, input и hint', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    expect(screen.getByText('Город')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Выберите город')).toBeInTheDocument();
  });

  it('рендерит текст ошибки вместо hint', () => {
    const props = createProps();

    render(<SelectInputUI {...props} error="Обязательное поле" />);

    expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
    expect(screen.queryByText('Выберите город')).not.toBeInTheDocument();
  });

  it('вызывает handleInputChange при вводе текста', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Моск' },
    });

    expect(props.handleInputChange).toHaveBeenCalledTimes(1);
  });

  it('вызывает handleInputFocus при фокусе на input', () => {
    const props = createProps();

    render(<SelectInputUI {...props} />);

    fireEvent.focus(screen.getByRole('combobox'));

    expect(props.handleInputFocus).toHaveBeenCalledTimes(1);
  });

  it('показывает кнопку с ChevronIcon, когда clear-кнопка не нужна', () => {
    const props = createProps();

    render(<SelectInputUI {...props} shouldShowClear={false} actionAriaLabel="Открыть список" />);

    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeInTheDocument();
    expect(screen.getByTestId('chevron-icon')).toHaveTextContent('closed');
  });

  it('показывает IconButton, когда shouldShowClear === true', () => {
    const props = createProps();

    render(
      <SelectInputUI
        {...props}
        shouldShowClear={true}
        actionAriaLabel="Очистить выбранное значение"
      />
    );

    expect(screen.getByRole('button', { name: 'Очистить выбранное значение' })).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();
  });

  it('вызывает handleActionClick при клике по action-кнопке', () => {
    const props = createProps();

    render(<SelectInputUI {...props} actionAriaLabel="Открыть список" />);

    fireEvent.click(screen.getByRole('button', { name: 'Открыть список' }));

    expect(props.handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('открывает dropdown и рендерит список опций', () => {
    const props = createProps();

    render(<SelectInputUI {...props} isOpen={true} />);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Москва' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Санкт-Петербург' })).toBeInTheDocument();
  });

  it('вызывает handleSelectOption при выборе опции', () => {
    const props = createProps();

    render(<SelectInputUI {...props} isOpen={true} />);

    fireEvent.click(screen.getByRole('option', { name: 'Москва' }));

    expect(props.handleSelectOption).toHaveBeenCalledTimes(1);
    expect(props.handleSelectOption).toHaveBeenCalledWith(options[0]);
  });

  it('проставляет aria-selected для выбранной опции', () => {
    const props = createProps();

    render(<SelectInputUI {...props} isOpen={true} selectedOption={options[1]} />);

    expect(screen.getByRole('option', { name: 'Москва' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(screen.getByRole('option', { name: 'Санкт-Петербург' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('показывает noOptionsText, если список пуст', () => {
    const props = createProps();

    render(<SelectInputUI {...props} isOpen={true} filteredOptions={[]} />);

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('прокидывает disabled в input и кнопку открытия', () => {
    const props = createProps();

    render(
      <SelectInputUI
        {...props}
        disabled={true}
        shouldShowClear={false}
        actionAriaLabel="Открыть список"
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Открыть список' })).toBeDisabled();
  });

  it('проставляет aria-expanded для input в зависимости от состояния', () => {
    const props = createProps();

    const { rerender } = render(<SelectInputUI {...props} isOpen={false} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');

    rerender(<SelectInputUI {...props} isOpen={true} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
  });
});
