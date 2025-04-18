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
  relativeDueDate?: { value: number; unit: 'days' | 'months' | 'weeks' };
  calculatedDate?: string;  
  link?: string;            
}