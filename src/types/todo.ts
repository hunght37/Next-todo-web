export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';
