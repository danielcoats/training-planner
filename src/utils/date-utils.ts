import { DateTime } from 'luxon';

export const isValidDate = (value: Date) => {
  return !isNaN(value.getTime());
};

export const isValidDateString = (value: string) => {
  return isValidDate(new Date(value));
};

export const formatDate = (value: Date | null) => {
  if (value === null) return '';
  return DateTime.fromJSDate(value).toISODate();
};

export const daysUntil = (date: string) => {
  const duration = DateTime.fromISO(date).diff(DateTime.now(), ['days']);
  return Math.round(duration.days);
};
