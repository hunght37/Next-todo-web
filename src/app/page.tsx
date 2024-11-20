'use client';

import { useState, useEffect } from 'react';
import TodoItem from '@/components/TodoItem';
import { Todo, FilterType, Priority } from '@/types/todo';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>('medium');
  const [newTodoDeadline, setNewTodoDeadline] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      completed: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline || undefined,
      subtasks: [],
      description: '',
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
    setNewTodoDeadline('');
    setNewTodoPriority('medium');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const addSubtask = (todoId: string, subtaskTitle: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? {
        ...todo,
        subtasks: [
          ...todo.subtasks,
          {
            id: Date.now().toString(),
            title: subtaskTitle,
            completed: false,
          }
        ]
      } : todo
    ));
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? {
        ...todo,
        subtasks: todo.subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        )
      } : todo
    ));
  };

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? {
        ...todo,
        subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId)
      } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Todo App
        </h1>
        
        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-8 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <select
              value={newTodoPriority}
              onChange={(e) => setNewTodoPriority(e.target.value as Priority)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input
              type="date"
              value={newTodoDeadline}
              onChange={(e) => setNewTodoDeadline(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{stats.total} total, </span>
          <span>{stats.completed} completed, </span>
          <span>{stats.active} active</span>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onAddSubtask={addSubtask}
              onToggleSubtask={toggleSubtask}
              onDeleteSubtask={deleteSubtask}
            />
          ))}
        </div>

        {filteredTodos.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No todos to display.
          </p>
        )}
      </div>
    </div>
  );
}
