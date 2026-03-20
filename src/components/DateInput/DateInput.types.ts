export type NullableDate = Date | null;

export type CalendarCell = {
  date: Date;
  currentMonth: boolean;
};

export type DateValidationOptions = {
  minDate: Date;
  maxDate: Date;
};
