'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Todo, Priority } from '@/types/todo';
import TodoItem from '@/components/TodoItem';
import { PlusIcon, FunnelIcon, Bars4Icon } from '@heroicons/react/24/outline';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>('medium');
  const [newTodoDeadline, setNewTodoDeadline] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch todos from API when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error: any) {
      setError(error?.message || 'An error occurred while fetching todos');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Add new todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = {
        title: newTodo.trim(),
        description: '',
        completed: false,
        priority: newTodoPriority,
        deadline: newTodoDeadline,
      };

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      
      const newTodoFromDB = await response.json();
      setTodos(prev => [newTodoFromDB, ...prev]);
      setNewTodo('');
      setNewTodoPriority('medium');
      setNewTodoDeadline('');
      setIsAddingTask(false);
    } catch (error: any) {
      setError(error?.message || 'An error occurred while creating todo');
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await response.json();
      setTodos(prev =>
        prev.map(todo => todo.id === id ? updatedTodo : todo)
      );
    } catch (error: any) {
      setError(error?.message || 'An error occurred while updating todo');
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');
      
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error: any) {
      setError(error?.message || 'An error occurred while deleting todo');
    }
  };

  // Update todo
  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await response.json();
      setTodos(prev =>
        prev.map(todo => todo.id === id ? updatedTodo : todo)
      );
    } catch (error: any) {
      setError(error?.message || 'An error occurred while updating todo');
    }
  };

  // Add subtask
  const addSubtask = async (todoId: string, title: string) => {
    try {
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;

      const updatedSubtasks = [
        ...todo.subtasks,
        { id: Date.now().toString(), title, completed: false }
      ];

      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks }),
      });

      if (!response.ok) throw new Error('Failed to add subtask');
      
      const updatedTodo = await response.json();
      setTodos(prev =>
        prev.map(todo => todo.id === todoId ? updatedTodo : todo)
      );
    } catch (error: any) {
      setError(error?.message || 'An error occurred while adding subtask');
    }
  };

  // Toggle subtask
  const toggleSubtask = async (todoId: string, subtaskId: string) => {
    try {
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;

      const updatedSubtasks = todo.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );

      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks }),
      });

      if (!response.ok) throw new Error('Failed to toggle subtask');
      
      const updatedTodo = await response.json();
      setTodos(prev =>
        prev.map(todo => todo.id === todoId ? updatedTodo : todo)
      );
    } catch (error: any) {
      setError(error?.message || 'An error occurred while toggling subtask');
    }
  };

  // Delete subtask
  const deleteSubtask = async (todoId: string, subtaskId: string) => {
    try {
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;

      const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);

      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks }),
      });

      if (!response.ok) throw new Error('Failed to delete subtask');
      
      const updatedTodo = await response.json();
      setTodos(prev =>
        prev.map(todo => todo.id === todoId ? updatedTodo : todo)
      );
    } catch (error: any) {
      setError(error?.message || 'An error occurred while deleting subtask');
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const task = {
        title: newTask.title,
        description: newTask.description,
        completed: false,
        priority: 'medium',
        deadline: '',
        subtasks: []
      };

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      const newTaskFromDB = await response.json();
      setTodos(prev => [newTaskFromDB, ...prev]);
      setNewTask({ title: '', description: '' });
      setIsAddTaskOpen(false);
    } catch (error: any) {
      setError(error?.message || 'An error occurred while creating task');
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with stats and controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <div className="text-sm">Total: {stats.total}</div>
          <div className="text-sm">Active: {stats.active}</div>
          <div className="text-sm">Completed: {stats.completed}</div>
        </div>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
            className="px-3 py-1 border rounded"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {viewMode === 'grid' ? <Bars4Icon className="w-5 h-5" /> : <FunnelIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
  
      {/* Add Task Button */}
      <button
        onClick={() => setIsAddTaskOpen(true)}
        className="mb-8 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Task
      </button>
  
      {/* Tasks Grid/List */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid-cols-1 gap-2'}`}>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
            onUpdate={(id: string, updates: Partial<Todo>) => updateTodo(id, updates)}
            onAddSubtask={(title) => addSubtask(todo.id, title)}
            onToggleSubtask={(subtaskId) => toggleSubtask(todo.id, subtaskId)}
            onDeleteSubtask={(subtaskId) => deleteSubtask(todo.id, subtaskId)}
          />
        ))}
      </div>
  
      {/* Add Task Dialog */}
      <Dialog
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />
  
          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <button
              onClick={() => setIsAddTaskOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
  
            <Dialog.Title className="text-lg font-medium mb-4">Add New Task</Dialog.Title>
  
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  placeholder="Enter task title"
                />
              </div>
  
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
  
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
