import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectInput, type TSelectOption } from './SelectInput';

type SelectInputUIProps = {
  id?: string;
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
  selectedOption: TSelectOption | null;
  filteredOptions: TSelectOption[];
  clearIconSrc: string;
  shouldShowClear: boolean;
  actionAriaLabel: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleActionClick: () => void;
  handleSelectOption: (option: TSelectOption) => void;
};

const selectInputUIMock = jest.fn<void, [SelectInputUIProps]>();

jest.mock('../ui/SelectInputUI', () => ({
  SelectInputUI: (props: SelectInputUIProps) => {
    selectInputUIMock(props);

    return (
      <div>
        <div data-testid="is-open">{String(props.isOpen)}</div>
        <div data-testid="input-value">{props.inputValue}</div>
        <div data-testid="selected-option">{props.selectedOption?.value ?? ''}</div>
        <div data-testid="filtered-options">
          {props.filteredOptions.map((option) => option.value).join(',')}
        </div>
        <div data-testid="should-show-clear">{String(props.shouldShowClear)}</div>
        <div data-testid="action-aria-label">{props.actionAriaLabel}</div>

        <button type="button" onClick={props.handleInputFocus}>
          focus-input
        </button>

        <button
          type="button"
          onClick={() =>
            props.handleInputChange({
              target: { value: 'мо' },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          change-input
        </button>

        <button type="button" onClick={props.handleActionClick}>
          action-click
        </button>

        <button type="button" onClick={() => props.handleSelectOption(props.filteredOptions[0])}>
          select-first
        </button>
      </div>
    );
  },
}));

jest.mock('../../assets/icons/cross.svg', () => 'cross.svg');

describe('SelectInput', () => {
  const options: TSelectOption[] = [
    { id: 1, value: 'Москва' },
    { id: 2, value: 'Самара' },
    { id: 3, value: 'Томск' },
  ];

  beforeEach(() => {
    selectInputUIMock.mockClear();
  });

  it('передает начальные значения в UI', () => {
    render(<SelectInput options={options} placeholder="Не указан" hint="Подсказка" />);

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('input-value')).toHaveTextContent('');
    expect(screen.getByTestId('selected-option')).toHaveTextContent('');
    expect(screen.getByTestId('filtered-options')).toHaveTextContent('Москва,Самара,Томск');
    expect(screen.getByTestId('should-show-clear')).toHaveTextContent('false');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent('Открыть список');
  });

  it('устанавливает defaultValue как выбранное значение и inputValue', () => {
    render(<SelectInput options={options} defaultValue="Самара" />);

    expect(screen.getByTestId('input-value')).toHaveTextContent('Самара');
    expect(screen.getByTestId('selected-option')).toHaveTextContent('Самара');
    expect(screen.getByTestId('should-show-clear')).toHaveTextContent('true');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent(
      'Очистить выбранное значение'
    );
  });

  it('открывает dropdown при фокусе на input', () => {
    render(<SelectInput options={options} />);

    fireEvent.click(screen.getByRole('button', { name: 'focus-input' }));

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent('Закрыть список');
  });

  it('открывает dropdown и фильтрует опции при вводе', () => {
    render(<SelectInput options={options} />);

    fireEvent.click(screen.getByRole('button', { name: 'change-input' }));

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    expect(screen.getByTestId('input-value')).toHaveTextContent('мо');
    expect(screen.getByTestId('filtered-options')).toHaveTextContent('Москва,Томск');
    expect(screen.getByTestId('should-show-clear')).toHaveTextContent('true');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent('Очистить поиск');
  });

  it('выбирает опцию и вызывает onChange', () => {
    const onChange = jest.fn();

    render(<SelectInput options={options} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'focus-input' }));
    fireEvent.click(screen.getByRole('button', { name: 'select-first' }));

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('input-value')).toHaveTextContent('Москва');
    expect(screen.getByTestId('selected-option')).toHaveTextContent('Москва');
    expect(screen.getByTestId('should-show-clear')).toHaveTextContent('true');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent(
      'Очистить выбранное значение'
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ id: 1, value: 'Москва' });
  });

  it('очищает поисковую строку по action-кнопке, когда список открыт и есть inputValue', () => {
    render(<SelectInput options={options} />);

    fireEvent.click(screen.getByRole('button', { name: 'change-input' }));
    expect(screen.getByTestId('input-value')).toHaveTextContent('мо');

    fireEvent.click(screen.getByRole('button', { name: 'action-click' }));

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    expect(screen.getByTestId('input-value')).toHaveTextContent('');
    expect(screen.getByTestId('filtered-options')).toHaveTextContent('Москва,Самара,Томск');
    expect(screen.getByTestId('should-show-clear')).toHaveTextContent('false');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent('Закрыть список');
  });

  it('очищает выбранное значение по action-кнопке, когда список закрыт и есть selectedOption', () => {
    const onChange = jest.fn();

    render(<SelectInput options={options} defaultValue="Самара" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'action-click' }));

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('input-value')).toHaveTextContent('');
    expect(screen.getByTestId('selected-option')).toHaveTextContent('');
    expect(screen.getByTestId('should-show-clear')).toHaveTextContent('false');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent('Открыть список');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('закрывает список и восстанавливает выбранное значение по action-кнопке, когда список открыт без поискового текста', () => {
    render(<SelectInput options={options} defaultValue="Самара" />);

    fireEvent.click(screen.getByRole('button', { name: 'focus-input' }));
    expect(screen.getByTestId('is-open')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: 'action-click' }));

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('input-value')).toHaveTextContent('Самара');
    expect(screen.getByTestId('selected-option')).toHaveTextContent('Самара');
  });

  it('открывает список по action-кнопке, когда ничего не выбрано', () => {
    render(<SelectInput options={options} />);

    fireEvent.click(screen.getByRole('button', { name: 'action-click' }));

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    expect(screen.getByTestId('action-aria-label')).toHaveTextContent('Закрыть список');
  });

  it('не открывается и не меняет состояние, если disabled=true', () => {
    render(<SelectInput options={options} disabled={true} defaultValue="Самара" />);

    fireEvent.click(screen.getByRole('button', { name: 'focus-input' }));
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');

    fireEvent.click(screen.getByRole('button', { name: 'action-click' }));
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('input-value')).toHaveTextContent('Самара');
    expect(screen.getByTestId('selected-option')).toHaveTextContent('Самара');
  });

  it('закрывает dropdown по клику вне компонента и восстанавливает выбранное значение', () => {
    render(<SelectInput options={options} defaultValue="Самара" />);

    fireEvent.click(screen.getByRole('button', { name: 'change-input' }));
    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    expect(screen.getByTestId('input-value')).toHaveTextContent('мо');

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('input-value')).toHaveTextContent('Самара');
    expect(screen.getByTestId('selected-option')).toHaveTextContent('Самара');
  });

  it('передает noOptionsText в UI', () => {
    render(<SelectInput options={options} noOptionsText="Совпадений нет" />);

    const calls = selectInputUIMock.mock.calls;
    const lastCallIndex = calls.length - 1;
    const [lastProps] = calls[lastCallIndex];

    expect(lastProps.noOptionsText).toBe('Совпадений нет');
  });
});
