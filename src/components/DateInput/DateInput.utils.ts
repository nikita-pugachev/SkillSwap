import { NullableDate, DateValidationOptions, CalendarCell } from '@/utils/types';

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDate(date: NullableDate): string {
  if (!date) return '';

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
}

export function parseDate(value: string): NullableDate {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const [, ddStr, mmStr, yyyyStr] = match;
  const day = Number(ddStr);
  const month = Number(mmStr) - 1;
  const year = Number(yyyyStr);

  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

export function maskDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isSameDate(a: NullableDate, b: NullableDate): boolean {
  if (!a || !b) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function validateDate(date: NullableDate, options: DateValidationOptions): string {
  const { minDate, maxDate } = options;

  if (!date) {
    return 'Введите корректную дату в формате дд.мм.гггг';
  }

  if (startOfDay(date).getTime() < startOfDay(minDate).getTime()) {
    return `Дата не может быть раньше ${formatDate(minDate)}`;
  }

  if (startOfDay(date).getTime() > startOfDay(maxDate).getTime()) {
    return `Дата не может быть позже ${formatDate(maxDate)}`;
  }

  return '';
}

export function isDateDisabled(date: Date, options: DateValidationOptions): boolean {
  const { minDate, maxDate } = options;
  const currentTime = startOfDay(date).getTime();

  return currentTime < startOfDay(minDate).getTime() || currentTime > startOfDay(maxDate).getTime();
}

export function getCalendarDays(viewDate: Date): CalendarCell[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7;

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const cells: CalendarCell[] = [];

  for (let i = startWeekDay - 1; i >= 0; i -= 1) {
    const day = daysInPrevMonth - i;
    cells.push({
      date: new Date(year, month - 1, day),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInCurrentMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  while (cells.length < 42) {
    const nextDay = cells.length - (startWeekDay + daysInCurrentMonth) + 1;
    cells.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });
  }

  return cells;
}
