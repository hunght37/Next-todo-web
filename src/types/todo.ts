import { Prisma, TaskStatus } from '@prisma/client';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  page: number;
  totalPages: number;
}

export type WhereClause = Prisma.TaskWhereInput;
