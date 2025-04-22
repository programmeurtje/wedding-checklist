// constants/appConfig.ts
export const ASYNC_STORAGE_KEYS = {
  WEDDING_DATE: 'wedding_date',
  TASKS: 'tasks_list',
  EXPANDED_SECTIONS: 'expanded_sections'
};

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  link?: string;
  calculatedDate?: string;
  relativeDueDate?: RelativeDueDate | string;
}

export interface RelativeDueDate {
  value: number;
  unit: 'days' | 'percentage';
  
}