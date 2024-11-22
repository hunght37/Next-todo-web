import axios from 'axios';
import { Task } from '@prisma/client';

const API_URL = '/api/tasks';

export type CreateTaskInput = {
  title: string;
  description?: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completed?: boolean;
};

export const TaskAPI = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (task: CreateTaskInput): Promise<Task> => {
    const response = await axios.post(API_URL, task);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, task: UpdateTaskInput): Promise<Task> => {
    const response = await axios.put(`${API_URL}/${id}`, task);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Toggle task completion
  toggleTaskCompletion: async (id: string): Promise<Task> => {
    const response = await axios.patch(`${API_URL}/${id}/toggle`);
    return response.data;
  },
};
