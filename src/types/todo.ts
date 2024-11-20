export type Priority = 'high' | 'medium' | 'low';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  deadline?: string;
  subtasks: SubTask[];
  description?: string;
}

export type FilterType = 'all' | 'active' | 'completed';
