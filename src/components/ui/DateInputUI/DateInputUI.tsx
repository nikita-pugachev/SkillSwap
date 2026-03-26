import {
  useState,
  type RefObject,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent,
  type ChangeEvent,
  type FocusEvent,
} from 'react';

import { MONTHS, WEEK_DAYS } from '../../DateInput/DateInput.constants';
import { CalendarCell, NullableDate } from '@/utils/types';
import { isSameDate, isDateDisabled } from '../../DateInput/DateInput.utils';
import styles from './DateInputUI.module.scss';
import { IconButton } from '../IconButton';
import { ChevronIcon } from '../Icons/ChevronIcon';
import { Button } from '../Button';
import { InputUI } from '../InputUI';

export interface DateInputUIProps {
  id: string;
  label: string;
  placeholder: string;
  wrapperRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;

  inputValue: string;
  error?: string;
  years: number[];
  viewDate: Date;
  minDate: Date;
  maxDate: Date;
  draftDate: NullableDate;
  isOpen: boolean;
  disabled: boolean;
  calendarDays: CalendarCell[];

  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleIconClick: () => void;
  handleIconMouseDown: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  handleCalendarKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handleMonthChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectDate: (date: Date) => void;
  cancelSelection: () => void;
  applyDate: () => void;
}

export const DateInputUI = ({
  disabled,
  id,
  label = 'Дата рождения',
  placeholder = 'дд.мм.гггг',
  wrapperRef,
  inputRef,
  dialogRef,
  error,
  inputValue,
  isOpen,
  viewDate,
  years,
  calendarDays,
  draftDate,
  minDate,
  maxDate,
  handleInputChange,
  handleInputFocus,
  handleInputKeyDown,
  handleInputBlur,
  handleIconClick,
  handleIconMouseDown,
  handleCalendarKeyDown,
  handleMonthChange,
  handleYearChange,
  selectDate,
  cancelSelection,
  applyDate,
}: DateInputUIProps) => {
  const errorId = `${id}-error`;
  const [activeSelect, setActiveSelect] = useState<'month' | 'year' | null>(null);
  return (
    <div ref={wrapperRef} className={styles.dateInputContainer}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={[styles.dateFrame, error ? styles.isError : ''].filter(Boolean).join(' ')}>
        <InputUI
          id={id}
          ref={inputRef}
          value={inputValue}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          inputMode="numeric"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'birth-date-error' : undefined}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={styles.input}
        />

        <IconButton
          type="button"
          onMouseDown={handleIconMouseDown}
          onClick={handleIconClick}
          ariaLabel="Открыть календарь"
          disabled={disabled}
          iconSrc="src/assets/icons/calendar.svg"
        />
      </div>

      {error ? (
        <div id={errorId} className={styles.errorInput}>
          {error}
        </div>
      ) : null}

      {isOpen ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-label="Выбор даты"
          tabIndex={0}
          onKeyDown={handleCalendarKeyDown}
          className={styles.calendarContainer}
        >
          <div className={styles.selectContainer}>
            <div className={styles.selectWrapper}>
              <select
                value={viewDate.getMonth()}
                onMouseDown={() => {
                  setActiveSelect((prev) => (prev === 'month' ? null : 'month'));
                }}
                onChange={(event) => {
                  handleMonthChange(event);
                  setActiveSelect(null);
                }}
                onBlur={() => {
                  setActiveSelect((prev) => (prev === 'month' ? null : prev));
                }}
                aria-label="Выберите месяц"
                className={styles.select}
              >
                {MONTHS.map((month: string, index: number) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <ChevronIcon
                className={[
                  styles.selectIcon,
                  activeSelect === 'month' ? styles.selectIconOpen : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </div>

            <div className={styles.selectWrapper}>
              <select
                value={viewDate.getFullYear()}
                onMouseDown={() => {
                  setActiveSelect((prev) => (prev === 'year' ? null : 'year'));
                }}
                onChange={(event) => {
                  handleYearChange(event);
                  setActiveSelect(null);
                }}
                onBlur={() => {
                  setActiveSelect((prev) => (prev === 'year' ? null : prev));
                }}
                aria-label="Выберите год"
                className={styles.select}
              >
                {years.map((year: number) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <ChevronIcon
                className={[styles.selectIcon, activeSelect === 'year' ? styles.selectIconOpen : '']
                  .filter(Boolean)
                  .join(' ')}
              />
            </div>
          </div>

          <div className={styles.calendar}>
            <div className={styles.weekDaysContainer}>
              {WEEK_DAYS.map((day: string) => (
                <div className={styles.weekDay} key={day}>
                  {day}
                </div>
              ))}
            </div>

            <div role="grid" aria-label="Календарь" className={styles.calendarDays}>
              {calendarDays.map((cell: CalendarCell) => {
                const isSelected = isSameDate(cell.date, draftDate);
                const disabled = isDateDisabled(cell.date, { minDate, maxDate });

                return (
                  <button
                    key={cell.date.toISOString()}
                    type="button"
                    role="gridcell"
                    onClick={() => selectDate(cell.date)}
                    disabled={disabled}
                    aria-selected={isSelected}
                    className={[
                      styles.calendarCell,
                      disabled ? styles.calendarCellDisabled : '',
                      isSelected ? styles.calendarCellSelected : '',
                      !cell.currentMonth ? styles.calendarCellNotCurrent : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {cell.date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.calendarButtonContainer}>
            <Button
              type="button"
              onClick={cancelSelection}
              variant="outlined"
              className={styles.button}
            >
              Отменить
            </Button>

            <Button type="button" onClick={applyDate} variant="primary" className={styles.button}>
              Выбрать
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
