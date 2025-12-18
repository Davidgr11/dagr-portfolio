import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  }).format(dateObj);
}

export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date | null,
  locale: string = 'en'
): string {
  const start = formatDate(startDate, locale);
  if (!endDate) {
    return `${start} - ${locale === 'es' ? 'Presente' : 'Present'}`;
  }
  const end = formatDate(endDate, locale);
  return `${start} - ${end}`;
}
