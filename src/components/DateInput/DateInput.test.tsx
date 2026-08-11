import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DateInput } from './DateInput';
import { DateInputUI } from '../ui/DateInputUI';
import {
  startOfDay,
  formatDate,
  parseDate,
  maskDateInput,
  getDaysInMonth,
  validateDate,
  isDateDisabled,
  getCalendarDays,
} from './DateInput.utils';

jest.mock('./DateInput.utils', () => ({
  startOfDay: jest.fn(),
  formatDate: jest.fn(),
  parseDate: jest.fn(),
  maskDateInput: jest.fn(),
  getDaysInMonth: jest.fn(),
  validateDate: jest.fn(),
  isDateDisabled: jest.fn(),
  getCalendarDays: jest.fn(),
}));

jest.mock('../ui/DateInputUI', () => ({
  DateInputUI: jest.fn(),
}));

const mockedDateInputUI = jest.mocked(DateInputUI);
const mockedStartOfDay = jest.mocked(startOfDay);
const mockedFormatDate = jest.mocked(formatDate);
const mockedParseDate = jest.mocked(parseDate);
const mockedMaskDateInput = jest.mocked(maskDateInput);
const mockedGetDaysInMonth = jest.mocked(getDaysInMonth);
const mockedValidateDate = jest.mocked(validateDate);
const mockedIsDateDisabled = jest.mocked(isDateDisabled);
const mockedGetCalendarDays = jest.mocked(getCalendarDays);

type DateInputUIProps = React.ComponentProps<typeof DateInputUI>;

describe('DateInput', () => {
  const today = new Date(2025, 0, 20);
  const validDate = new Date(2024, 4, 15);

  const defaultProps = {
    disabled: false,
    id: 'birth-date',
    label: 'Дата рождения',
    placeholder: 'дд.мм.гггг',
  };

  function renderComponent(overrideProps: Partial<React.ComponentProps<typeof DateInput>> = {}) {
    return render(<DateInput {...defaultProps} {...overrideProps} />);
  }

  beforeEach(() => {
    jest.clearAllMocks();

    mockedDateInputUI.mockImplementation((props: DateInputUIProps) => (
      <div data-testid="date-input-ui">
        <label htmlFor={props.id} data-testid="label">
          {props.label}
        </label>

        <div data-testid="error">{props.error}</div>
        <div data-testid="input-value">{props.inputValue}</div>
        <div data-testid="is-open">{String(props.isOpen)}</div>
        <div data-testid="view-date">{props.viewDate.toISOString()}</div>
        <div data-testid="draft-date">
          {props.draftDate ? props.draftDate.toISOString() : 'null'}
        </div>

        <input
          id={props.id}
          data-testid="input"
          placeholder={props.placeholder}
          value={props.inputValue}
          onChange={props.handleInputChange}
          onFocus={props.handleInputFocus}
          onKeyDown={props.handleInputKeyDown}
          onBlur={props.handleInputBlur}
        />

        <button
          type="button"
          data-testid="icon-button"
          onMouseDown={props.handleIconMouseDown}
          onClick={props.handleIconClick}
        >
          icon
        </button>

        <div data-testid="calendar" tabIndex={0} onKeyDown={props.handleCalendarKeyDown}>
          calendar
        </div>

        <select
          data-testid="month-select"
          value={props.viewDate.getMonth()}
          onChange={props.handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          data-testid="year-select"
          value={props.viewDate.getFullYear()}
          onChange={props.handleYearChange}
        >
          {props.years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="button"
          data-testid="select-date-button"
          onClick={() => props.selectDate(validDate)}
        >
          select-date
        </button>

        <button type="button" data-testid="cancel-button" onClick={props.cancelSelection}>
          cancel
        </button>

        <button type="button" data-testid="apply-button" onClick={props.applyDate}>
          apply
        </button>
      </div>
    ));

    mockedStartOfDay.mockReturnValue(today);

    mockedFormatDate.mockImplementation((date) => {
      if (!date) {
        return '';
      }

      if (date.getTime() === validDate.getTime()) {
        return '15.05.2024';
      }

      return `formatted-${date.getTime()}`;
    });

    mockedParseDate.mockReturnValue(null);
    mockedMaskDateInput.mockImplementation((value) => value);

    mockedGetDaysInMonth.mockImplementation((year, month) => {
      return new Date(year, month + 1, 0).getDate();
    });

    mockedValidateDate.mockReturnValue('');
    mockedIsDateDisabled.mockReturnValue(false);
    mockedGetCalendarDays.mockReturnValue([]);
  });

  it('прокидывает id, label и placeholder в DateInputUI', () => {
    renderComponent();

    expect(screen.getByTestId('label')).toHaveTextContent('Дата рождения');

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('id', 'birth-date');
    expect(input).toHaveAttribute('placeholder', 'дд.мм.гггг');

    expect(mockedDateInputUI).toHaveBeenCalled();
    const firstCallProps = mockedDateInputUI.mock.calls[0][0];

    expect(firstCallProps.id).toBe('birth-date');
    expect(firstCallProps.label).toBe('Дата рождения');
    expect(firstCallProps.placeholder).toBe('дд.мм.гггг');
  });

  it('открывает календарь при фокусе на input', () => {
    renderComponent();

    fireEvent.focus(screen.getByTestId('input'));

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
  });

  it('обновляет inputValue через maskDateInput', () => {
    mockedMaskDateInput.mockReturnValue('12.12.2024');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '12122024' },
    });

    expect(mockedMaskDateInput).toHaveBeenCalledWith('12122024');
    expect(screen.getByTestId('input-value')).toHaveTextContent('12.12.2024');
  });

  it('показывает ошибку для некорректной даты', () => {
    mockedMaskDateInput.mockReturnValue('99.99.9999');
    mockedParseDate.mockReturnValue(null);

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '99.99.9999' },
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Некорректная дата');
  });

  it('не показывает ошибку при неполной дате во время ввода', () => {
    mockedMaskDateInput.mockReturnValue('12.12');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '12.12' },
    });

    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('показывает ошибку на blur, если дата не заполнена', () => {
    renderComponent();

    fireEvent.blur(screen.getByTestId('input'));

    expect(screen.getByTestId('error')).toHaveTextContent('Введите дату');
  });

  it('показывает ошибку на blur, если дата введена не полностью', () => {
    mockedMaskDateInput.mockReturnValue('12.12');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '12.12' },
    });

    fireEvent.blur(screen.getByTestId('input'));

    expect(screen.getByTestId('error')).toHaveTextContent(
      'Введите дату полностью в формате дд.мм.гггг'
    );
  });

  it('синхронизирует draftDate и viewDate для валидной даты', () => {
    mockedMaskDateInput.mockReturnValue('15.05.2024');
    mockedParseDate.mockImplementation((value) => (value === '15.05.2024' ? validDate : null));
    mockedValidateDate.mockReturnValue('');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '15.05.2024' },
    });

    expect(screen.getByTestId('draft-date')).toHaveTextContent(validDate.toISOString());
    expect(screen.getByTestId('view-date')).toHaveTextContent(validDate.toISOString());
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('выбирает дату через selectDate', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('select-date-button'));

    expect(mockedIsDateDisabled).toHaveBeenCalled();
    expect(screen.getByTestId('input-value')).toHaveTextContent('15.05.2024');
    expect(screen.getByTestId('draft-date')).toHaveTextContent(validDate.toISOString());
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('не выбирает disabled дату', () => {
    mockedIsDateDisabled.mockReturnValue(true);

    renderComponent();

    fireEvent.click(screen.getByTestId('select-date-button'));

    expect(screen.getByTestId('input-value')).toBeEmptyDOMElement();
    expect(screen.getByTestId('draft-date')).toHaveTextContent('null');
  });

  it('применяет дату из input по apply', () => {
    mockedMaskDateInput.mockReturnValue('15.05.2024');
    mockedParseDate.mockImplementation((value) => (value === '15.05.2024' ? validDate : null));
    mockedValidateDate.mockReturnValue('');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '15.05.2024' },
    });

    fireEvent.click(screen.getByTestId('apply-button'));

    expect(screen.getByTestId('input-value')).toHaveTextContent('15.05.2024');
    expect(screen.getByTestId('draft-date')).toHaveTextContent(validDate.toISOString());
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
  });

  it('показывает ошибку при apply, если дата невалидна', () => {
    mockedParseDate.mockReturnValue(null);

    renderComponent();

    fireEvent.click(screen.getByTestId('apply-button'));

    expect(screen.getByTestId('error')).toHaveTextContent('Выберите корректную дату');
  });

  it('сбрасывает состояние через cancelSelection', () => {
    mockedMaskDateInput.mockReturnValue('15.05.2024');
    mockedParseDate.mockImplementation((value) => (value === '15.05.2024' ? validDate : null));
    mockedValidateDate.mockReturnValue('');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '15.05.2024' },
    });

    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(screen.getByTestId('input-value')).toHaveTextContent('');
    expect(screen.getByTestId('draft-date')).toHaveTextContent('null');
    expect(screen.getByTestId('view-date')).toHaveTextContent(today.toISOString());
    expect(screen.getByTestId('error')).toHaveTextContent('');
    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
  });

  it('открывает календарь по ArrowDown в input', () => {
    renderComponent();

    fireEvent.keyDown(screen.getByTestId('input'), { key: 'ArrowDown' });

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
  });

  it('обрабатывает Enter в input для валидной даты', () => {
    mockedMaskDateInput.mockReturnValue('15.05.2024');
    mockedParseDate.mockReturnValue(validDate);
    mockedValidateDate.mockReturnValue('');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '15.05.2024' },
    });

    fireEvent.keyDown(screen.getByTestId('input'), { key: 'Enter' });

    expect(screen.getByTestId('draft-date')).toHaveTextContent(validDate.toISOString());
    expect(screen.getByTestId('view-date')).toHaveTextContent(validDate.toISOString());
    expect(screen.getByTestId('input-value')).toHaveTextContent('15.05.2024');
  });

  it('меняет месяц через select', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('month-select'), {
      target: { value: '5' },
    });

    expect(screen.getByTestId('view-date')).toHaveTextContent(new Date(2025, 5, 20).toISOString());
  });

  it('меняет год через select', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('year-select'), {
      target: { value: '2024' },
    });

    expect(screen.getByTestId('view-date')).toHaveTextContent(new Date(2024, 0, 20).toISOString());
  });

  it('двигает focused day по ArrowRight в календаре', () => {
    renderComponent();

    fireEvent.focus(screen.getByTestId('input'));
    fireEvent.keyDown(screen.getByTestId('calendar'), { key: 'ArrowRight' });

    expect(screen.getByTestId('view-date')).toHaveTextContent(new Date(2025, 0, 21).toISOString());
  });

  it('выбирает focused day по Enter в календаре', () => {
    renderComponent();

    fireEvent.focus(screen.getByTestId('input'));
    fireEvent.keyDown(screen.getByTestId('calendar'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByTestId('calendar'), { key: 'Enter' });

    expect(screen.getByTestId('input-value')).toHaveTextContent(
      `formatted-${new Date(2025, 0, 21).getTime()}`
    );
  });

  it('по клику на иконку открывает календарь, если он закрыт', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('icon-button'));

    expect(screen.getByTestId('is-open')).toHaveTextContent('true');
  });

  it('по клику на иконку сбрасывает состояние, если календарь открыт', () => {
    mockedMaskDateInput.mockReturnValue('15.05.2024');
    mockedParseDate.mockReturnValue(validDate);
    mockedValidateDate.mockReturnValue('');

    renderComponent();

    fireEvent.change(screen.getByTestId('input'), {
      target: { value: '15.05.2024' },
    });

    fireEvent.focus(screen.getByTestId('input'));
    fireEvent.click(screen.getByTestId('icon-button'));

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('input-value')).toHaveTextContent('');
    expect(screen.getByTestId('draft-date')).toHaveTextContent('null');
  });
});
