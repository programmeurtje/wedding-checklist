import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { RelativeDueDate } from '../constants/appConfig';

export function calculateDateFromWedding(
  weddingDateStr: string | null | Date,
  relativeDue?: RelativeDueDate
): string | undefined {
  if (!weddingDateStr || !relativeDue) {
    return undefined;
  }

  try {
    const weddingDate = new Date(weddingDateStr);
    let calculatedDate: Date;

    switch (relativeDue.unit) {
      case 'days':
        calculatedDate = subDays(weddingDate, relativeDue.value);
        break;
      case 'weeks':
        calculatedDate = subWeeks(weddingDate, relativeDue.value);
        break;
      case 'months':
        calculatedDate = subMonths(weddingDate, relativeDue.value);
        break;
      default:
        return undefined;
    }
    return `By ${format(calculatedDate, 'MMM dd, yyyy')}`;

  } catch (error) {
    console.error("Error calculating date:", error);
    return undefined; // Return undefined on error
  }
}

export function isValidDateString(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}