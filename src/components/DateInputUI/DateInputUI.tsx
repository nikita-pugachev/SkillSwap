import React, { MouseEvent as ReactMouseEvent, KeyboardEvent, ChangeEvent } from 'react';

import { MONTHS, WEEK_DAYS } from '../DateInput/DateInput.constants';
import { CalendarCell, NullableDate } from '../DateInput/DateInput.types';
import { isSameDate, isDateDisabled } from '../DateInput/DateInput.utils';
import styles from './DateInputUI.module.scss';

export interface DateInputUIProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  dialogRef: React.RefObject<HTMLDivElement | null>;

  inputValue: string;
  error?: string;
  years: number[];
  viewDate: Date;
  minDate: Date;
  maxDate: Date;
  draftDate: NullableDate;
  focusedDay: NullableDate;
  isOpen: boolean;
  calendarDays: CalendarCell[];

  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
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
  focusedDay,
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
  return (
    <div ref={wrapperRef} className={styles.dateInputContainer}>
      <label
        htmlFor="birth-date"
        style={{
          display: 'block',
          marginBottom: 8,
          color: '#4b4b4b',
          fontSize: 14,
        }}
      >
        Дата рождения
      </label>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${error ? '#d9534f' : '#aab09b'}`,
          borderRadius: 12,
          padding: '10px 12px',
          background: '#ffffff',
        }}
      >
        <input
          id="birth-date"
          ref={inputRef}
          value={inputValue}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder="дд.мм.гггг"
          inputMode="numeric"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'birth-date-error' : undefined}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 16,
            background: 'transparent',
          }}
        />

        <button
          type="button"
          onMouseDown={handleIconMouseDown}
          onClick={handleIconClick}
          aria-label="Открыть календарь"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          📅
        </button>
      </div>

      {error ? (
        <div
          id="birth-date-error"
          style={{
            marginTop: 6,
            color: '#d9534f',
            fontSize: 13,
          }}
        >
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
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: 320,
            background: '#f8f8f3',
            border: '1px solid #cfd6bf',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <select
              value={viewDate.getMonth()}
              onChange={handleMonthChange}
              aria-label="Выберите месяц"
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #aab09b',
                background: '#ffffff',
              }}
            >
              {MONTHS.map((month: string, index: number) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={viewDate.getFullYear()}
              onChange={handleYearChange}
              aria-label="Выберите год"
              style={{
                width: 120,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #aab09b',
                background: '#ffffff',
              }}
            >
              {years.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              marginBottom: 12,
              textAlign: 'center',
              color: '#7b8a5d',
              fontSize: 13,
            }}
          >
            {WEEK_DAYS.map((day: string) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div
            role="grid"
            aria-label="Календарь"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {calendarDays.map((cell: CalendarCell) => {
              const isSelected = isSameDate(cell.date, draftDate);
              const isFocused = isSameDate(cell.date, focusedDay);
              const disabled = isDateDisabled(cell.date, { minDate, maxDate });

              return (
                <button
                  key={cell.date.toISOString()}
                  type="button"
                  role="gridcell"
                  onClick={() => selectDate(cell.date)}
                  disabled={disabled}
                  aria-selected={isSelected}
                  style={{
                    height: 36,
                    borderRadius: '50%',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    border: isFocused ? '2px solid #7aa23f' : '1px solid transparent',
                    background: isSelected ? '#a8cf67' : 'transparent',
                    color: disabled ? '#c8c8c8' : cell.currentMonth ? '#2f2f2f' : '#a9a9a9',
                    fontWeight: isSelected ? 600 : 400,
                    outline: 'none',
                    opacity: disabled ? 0.6 : 1,
                  }}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={cancelSelection}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid #a8cf67',
                background: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Отменить
            </button>

            <button
              type="button"
              onClick={applyDate}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid #a8cf67',
                background: '#a8cf67',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Выбрать
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
