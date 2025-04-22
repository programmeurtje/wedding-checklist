import { format, subDays, subWeeks, subMonths, parseISO } from 'date-fns';
import { RelativeDueDate } from '../constants/appConfig';

// export function calculateDateFromWedding(
//   weddingDateStr: string | null | Date,
//   relativeDue?: RelativeDueDate | string
// ): string | undefined {
//   if (!weddingDateStr || !relativeDue) {
//     return undefined;
//   }

//   try {
//     const weddingDate = new Date(weddingDateStr);
//     let calculatedDate: Date;

//     // Handle object-based relativeDueDate (e.g., { value: 391, unit: 'days' })
//     if (relativeDue && typeof relativeDue === 'object' && relativeDue.unit === 'days') {
//       calculatedDate = subDays(weddingDate, relativeDue.value);
//     } else {
//       return undefined;
//     }
//     // Handle string-based relativeDueDate (legacy support)
//     else if (typeof relativeDue === 'string') {
//       // Parse the string format - assuming it's a date string
//       // This might need adjustment based on your actual string format
//       try {
//         calculatedDate = new Date(relativeDue);
//         if (isNaN(calculatedDate.getTime())) {
//           return undefined;
//         }
//       } catch (e) {
//         console.error("Invalid date string:", e);
//         return undefined;
//       }
//     } else {
//       return undefined;
//     }
    
//     return `By ${format(calculatedDate, 'MMM dd, yyyy')}`;

//   } catch (error) {
//     console.error("Error calculating date:", error, "with relativeDue:", relativeDue);
//     return undefined; // Return undefined on error
//   }
// }

export function isValidDateString(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}