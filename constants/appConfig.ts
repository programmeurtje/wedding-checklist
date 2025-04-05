export const ASYNC_STORAGE_KEYS = {
    WEDDING_DATE: 'weddingDate',
    TASKS: 'tasks',
  };
  
  export type RelativeDueDate = {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  
  export type Task = {
    id: string;
    text: string;
    completed: boolean;
    relativeDueDate?: RelativeDueDate; 
    calculatedDate?: string; 
    link?: string;
    category?: string; 
  };