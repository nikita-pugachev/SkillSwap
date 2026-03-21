import React, {
  KeyboardEvent,
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  JSX,
  useCallback,
} from 'react';
import { NullableDate, CalendarCell } from '@/utils/types';
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
import { DateInputUI } from '../ui/DateInputUI';

export interface DateInputProps {
  disabled?: boolean;
}

export function DateInput({ disabled }: DateInputProps): JSX.Element {
  const today = useMemo<Date>(() => startOfDay(new Date()), []);
  const minDate = useMemo<Date>(() => new Date(1900, 0, 1), []);
  const maxDate = today;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<NullableDate>(null);
  const [draftDate, setDraftDate] = useState<NullableDate>(null);

  const base = draftDate ?? selectedDate ?? today;
  const [focusedDay, setFocusedDay] = useState<NullableDate>(base);
  const [viewDate, setViewDate] = useState<Date>(today);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

  const years = useMemo<number[]>(() => {
    const result: number[] = [];

    for (let year = maxDate.getFullYear(); year >= minDate.getFullYear(); year -= 1) {
      result.push(year);
    }

    return result;
  }, [minDate, maxDate]);

  const calendarDays = useMemo<CalendarCell[]>(() => getCalendarDays(viewDate), [viewDate]);

  const closeCalendar = useCallback(
    (resetDraft: boolean = false): void => {
      if (resetDraft) {
        setDraftDate(selectedDate);
        setInputValue(selectedDate ? formatDate(selectedDate) : '');
        setViewDate(selectedDate ?? today);
        setFocusedDay(selectedDate ?? today);
        setError('');
      }

      setIsOpen(false);
    },
    [selectedDate, today]
  );

  function openCalendar(): void {
    const parsed = parseDate(inputValue);
    const parsedError = parsed ? validateDate(parsed, { minDate, maxDate }) : 'invalid';
    const baseDate = parsed && !parsedError ? parsed : (selectedDate ?? today);

    setDraftDate(baseDate);
    setFocusedDay(baseDate);
    setViewDate(baseDate);
    setIsOpen(true);
  }

  function syncFromTypedValue(masked: string): void {
    if (!masked) {
      setError(touched ? 'Введите дату' : '');
      return;
    }

    if (masked.length < 10) {
      setError('');
      return;
    }

    const parsed = parseDate(masked);

    if (!parsed) {
      setError('Некорректная дата');
      return;
    }

    const validationError = validateDate(parsed, { minDate, maxDate });

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setDraftDate(parsed);
    setFocusedDay(parsed);
    setViewDate(parsed);
  }

  function selectDate(date: Date): void {
    if (isDateDisabled(date, { minDate, maxDate })) {
      return;
    }

    setDraftDate(date);
    setFocusedDay(date);
    setViewDate(date);
    setInputValue(formatDate(date));
    setError('');
  }

  function applyDate(): void {
    const parsed = parseDate(inputValue);

    if (parsed) {
      const validationError = validateDate(parsed, { minDate, maxDate });

      if (!validationError) {
        setSelectedDate(parsed);
        setDraftDate(parsed);
        setFocusedDay(parsed);
        setViewDate(parsed);
        setInputValue(formatDate(parsed));
        setError('');
        setIsOpen(false);
        return;
      }
    }

    if (draftDate) {
      const validationError = validateDate(draftDate, { minDate, maxDate });

      if (!validationError) {
        setSelectedDate(draftDate);
        setInputValue(formatDate(draftDate));
        setError('');
        setIsOpen(false);
        return;
      }
    }

    setError('Выберите корректную дату');
  }

  function cancelSelection(): void {
    setSelectedDate(null);
    setDraftDate(null);
    setInputValue('');
    setViewDate(today);
    setFocusedDay(today);
    setError('');
    setIsOpen(false);
  }

  function moveFocusedDay(diff: number): void {
    const base = focusedDay ?? draftDate ?? selectedDate ?? today;
    const next = new Date(base);
    next.setDate(base.getDate() + diff);

    setFocusedDay(next);
    setViewDate(next);
  }

  function handleInputFocus(): void {
    openCalendar();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const masked = maskDateInput(event.target.value);

    setInputValue(masked);
    setTouched(true);
    syncFromTypedValue(masked);
  }

  function handleInputBlur(event: React.FocusEvent<HTMLInputElement>): void {
    const nextFocused = event.relatedTarget;

    if (nextFocused instanceof Node && wrapperRef.current?.contains(nextFocused)) {
      return;
    }

    setTouched(true);

    if (!inputValue) {
      setError('Введите дату');
      return;
    }

    if (inputValue.length < 10) {
      setError('Введите дату полностью в формате дд.мм.гггг');
      return;
    }

    const parsed = parseDate(inputValue);

    if (!parsed) {
      setError('Некорректная дата');
      return;
    }

    const validationError = validateDate(parsed, { minDate, maxDate });
    setError(validationError);
  }

  function handleMonthChange(event: ChangeEvent<HTMLSelectElement>): void {
    const month = Number(event.target.value);

    setViewDate((prev: Date) => {
      const year = prev.getFullYear();
      const baseDay = (focusedDay ?? today).getDate();
      const safeDay = Math.min(baseDay, getDaysInMonth(year, month));
      return new Date(year, month, safeDay);
    });
  }

  function handleYearChange(event: ChangeEvent<HTMLSelectElement>): void {
    const year = Number(event.target.value);

    setViewDate((prev: Date) => {
      const month = prev.getMonth();
      const baseDay = (focusedDay ?? today).getDate();
      const safeDay = Math.min(baseDay, getDaysInMonth(year, month));
      return new Date(year, month, safeDay);
    });
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!isOpen) {
        openCalendar();
      }
    }

    if (event.key === 'Enter') {
      const parsed = parseDate(inputValue);

      if (parsed) {
        const validationError = validateDate(parsed, { minDate, maxDate });

        if (!validationError) {
          setDraftDate(parsed);
          setFocusedDay(parsed);
          setViewDate(parsed);
          setInputValue(formatDate(parsed));
          setError('');
        }
      }
    }

    if (event.key === 'Escape') {
      closeCalendar(true);
      inputRef.current?.blur();
    }
  }

  function handleCalendarKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (!isOpen) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveFocusedDay(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveFocusedDay(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocusedDay(-7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveFocusedDay(7);
        break;
      case 'Home': {
        event.preventDefault();

        if (focusedDay) {
          const weekday = (focusedDay.getDay() + 6) % 7;
          moveFocusedDay(-weekday);
        }
        break;
      }
      case 'End': {
        event.preventDefault();

        if (focusedDay) {
          const weekday = (focusedDay.getDay() + 6) % 7;
          moveFocusedDay(6 - weekday);
        }
        break;
      }
      case 'PageUp': {
        event.preventDefault();

        setViewDate((prev: Date) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        setFocusedDay((prev: NullableDate) => {
          const base = prev ?? today;
          const year = base.getFullYear();
          const month = base.getMonth() - 1;
          const day = Math.min(base.getDate(), getDaysInMonth(year, month));
          return new Date(year, month, day);
        });
        break;
      }
      case 'PageDown': {
        event.preventDefault();

        setViewDate((prev: Date) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        setFocusedDay((prev: NullableDate) => {
          const base = prev ?? today;
          const year = base.getFullYear();
          const month = base.getMonth() + 1;
          const day = Math.min(base.getDate(), getDaysInMonth(year, month));
          return new Date(year, month, day);
        });
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();

        if (focusedDay && !isDateDisabled(focusedDay, { minDate, maxDate })) {
          selectDate(focusedDay);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        cancelSelection();
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  }

  function handleIconMouseDown(event: ReactMouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
  }

  function handleIconClick(): void {
    if (isOpen) {
      cancelSelection();
      return;
    }

    openCalendar();
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        closeCalendar(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedDate, today, closeCalendar]);

  return (
    <DateInputUI
      disabled={disabled}
      wrapperRef={wrapperRef}
      error={error}
      inputRef={inputRef}
      dialogRef={dialogRef}
      inputValue={inputValue}
      handleInputChange={handleInputChange}
      handleInputFocus={handleInputFocus}
      handleInputKeyDown={handleInputKeyDown}
      handleInputBlur={handleInputBlur}
      isOpen={isOpen}
      handleIconClick={handleIconClick}
      handleIconMouseDown={handleIconMouseDown}
      handleCalendarKeyDown={handleCalendarKeyDown}
      handleMonthChange={handleMonthChange}
      handleYearChange={handleYearChange}
      selectDate={selectDate}
      viewDate={viewDate}
      years={years}
      calendarDays={calendarDays}
      draftDate={draftDate}
      minDate={minDate}
      maxDate={maxDate}
      cancelSelection={cancelSelection}
      applyDate={applyDate}
    />
  );
}
