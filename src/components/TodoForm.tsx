'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Todo } from '@/types/todo';
import { TaskStatus } from '@prisma/client';

type TodoInput = Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'completed'>;

interface TodoFormProps {
  onSubmit: (todo: TodoInput) => void;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({
        title: text.trim(),
        description: '',
        completed: false,
        status: TaskStatus.PENDING,
        priority: 0,
      });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-4 py-3 bg-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
          />
          <Plus className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}
