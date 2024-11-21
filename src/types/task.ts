export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  subTasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}
