'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import type { Todo } from '@/types/todo';
import { List, Grid } from 'lucide-react';

export default function HomeContent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data.todos || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (
    newTodo: Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'completed'>
  ) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  const handleUpdateTodo = async (id: string, updatedTodo: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <TodoForm onSubmit={handleAddTodo} />
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Todo List</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <Grid size={20} />
          </button>
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <TodoList
          todos={todos}
          loading={loading}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
