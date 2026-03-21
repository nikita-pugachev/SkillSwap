import {
  startOfDay,
  formatDate,
  parseDate,
  maskDateInput,
  getDaysInMonth,
  isSameDate,
  validateDate,
  isDateDisabled,
  getCalendarDays,
} from '@/components/DateInput/DateInput.utils';

import { DateValidationOptions } from '@/utils/types';

describe('DateInput.utils', () => {
  describe('startOfDay', () => {
    it('сбрасывает время до начала суток', () => {
      const date = new Date(2024, 4, 15, 13, 45, 20, 500);

      const result = startOfDay(date);

      expect(result).toEqual(new Date(2024, 4, 15));
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('formatDate', () => {
    it('возвращает пустую строку для null', () => {
      expect(formatDate(null)).toBe('');
    });

    it('форматирует дату в дд.мм.гггг', () => {
      expect(formatDate(new Date(2024, 0, 5))).toBe('05.01.2024');
    });
  });

  describe('parseDate', () => {
    it('парсит корректную дату', () => {
      const result = parseDate('05.01.2024');

      expect(result).toEqual(new Date(2024, 0, 5));
    });

    it('возвращает null для некорректного формата', () => {
      expect(parseDate('2024-01-05')).toBeNull();
      expect(parseDate('5.1.2024')).toBeNull();
      expect(parseDate('')).toBeNull();
    });

    it('возвращает null для несуществующей даты', () => {
      expect(parseDate('31.02.2024')).toBeNull();
      expect(parseDate('32.01.2024')).toBeNull();
      expect(parseDate('00.12.2024')).toBeNull();
    });
  });

  describe('maskDateInput', () => {
    it('оставляет только цифры', () => {
      expect(maskDateInput('12ab34cd5678')).toBe('12.34.5678');
    });

    it('ограничивает ввод 8 цифрами', () => {
      expect(maskDateInput('123456789999')).toBe('12.34.5678');
    });

    it('ставит точки после дня и месяца', () => {
      expect(maskDateInput('1')).toBe('1');
      expect(maskDateInput('12')).toBe('12');
      expect(maskDateInput('123')).toBe('12.3');
      expect(maskDateInput('1234')).toBe('12.34');
      expect(maskDateInput('12345')).toBe('12.34.5');
      expect(maskDateInput('12345678')).toBe('12.34.5678');
    });
  });

  describe('getDaysInMonth', () => {
    it('возвращает количество дней в месяце', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
      expect(getDaysInMonth(2024, 1)).toBe(29);
      expect(getDaysInMonth(2023, 1)).toBe(28);
      expect(getDaysInMonth(2024, 3)).toBe(30);
    });
  });

  describe('isSameDate', () => {
    it('возвращает true для одинаковых дат', () => {
      expect(isSameDate(new Date(2024, 5, 10), new Date(2024, 5, 10))).toBe(true);
    });

    it('возвращает false для разных дат', () => {
      expect(isSameDate(new Date(2024, 5, 10), new Date(2024, 5, 11))).toBe(false);
    });

    it('возвращает false если одна из дат null', () => {
      expect(isSameDate(null, new Date(2024, 5, 10))).toBe(false);
      expect(isSameDate(new Date(2024, 5, 10), null)).toBe(false);
      expect(isSameDate(null, null)).toBe(false);
    });
  });

  describe('validateDate', () => {
    const options: DateValidationOptions = {
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 11, 31),
    };

    it('возвращает ошибку для null', () => {
      expect(validateDate(null, options)).toBe('Введите корректную дату в формате дд.мм.гггг');
    });

    it('возвращает ошибку если дата меньше minDate', () => {
      expect(validateDate(new Date(2019, 11, 31), options)).toBe(
        'Дата не может быть раньше 01.01.2020'
      );
    });

    it('возвращает ошибку если дата больше maxDate', () => {
      expect(validateDate(new Date(2026, 0, 1), options)).toBe(
        'Дата не может быть позже 31.12.2025'
      );
    });

    it('возвращает пустую строку для валидной даты', () => {
      expect(validateDate(new Date(2024, 3, 20), options)).toBe('');
    });
  });

  describe('isDateDisabled', () => {
    const options: DateValidationOptions = {
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 11, 31),
    };

    it('возвращает true если дата меньше minDate', () => {
      expect(isDateDisabled(new Date(2019, 11, 31), options)).toBe(true);
    });

    it('возвращает true если дата больше maxDate', () => {
      expect(isDateDisabled(new Date(2026, 0, 1), options)).toBe(true);
    });

    it('возвращает false если дата в диапазоне', () => {
      expect(isDateDisabled(new Date(2024, 6, 10), options)).toBe(false);
    });

    it('сравнивает только день, а не время', () => {
      expect(isDateDisabled(new Date(2020, 0, 1, 23, 59, 59), options)).toBe(false);
      expect(isDateDisabled(new Date(2025, 11, 31, 23, 59, 59), options)).toBe(false);
    });
  });

  describe('getCalendarDays', () => {
    it('всегда возвращает 42 ячейки', () => {
      const result = getCalendarDays(new Date(2024, 4, 15));

      expect(result).toHaveLength(42);
    });

    it('корректно строит календарь месяца с днями предыдущего и следующего месяцев', () => {
      const result = getCalendarDays(new Date(2024, 4, 15));

      expect(result[0]).toEqual({
        date: new Date(2024, 3, 29),
        currentMonth: false,
      });

      expect(result[2]).toEqual({
        date: new Date(2024, 4, 1),
        currentMonth: true,
      });

      expect(result[32]).toEqual({
        date: new Date(2024, 4, 31),
        currentMonth: true,
      });

      expect(result[33]).toEqual({
        date: new Date(2024, 5, 1),
        currentMonth: false,
      });
    });

    it('помечает дни текущего месяца через currentMonth', () => {
      const result = getCalendarDays(new Date(2024, 1, 10));

      const currentMonthCells = result.filter((cell) => cell.currentMonth);
      const otherMonthCells = result.filter((cell) => !cell.currentMonth);

      expect(currentMonthCells).toHaveLength(29);
      expect(otherMonthCells).toHaveLength(13);
    });
  });
});
