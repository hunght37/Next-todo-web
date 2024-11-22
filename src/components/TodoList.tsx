'use client';

import { useState } from 'react';
import type { Todo } from '@/types/todo';
import { Trash2, Edit2, Check, X, Star, Calendar } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  loading?: boolean;
  onUpdate: (id: string, todo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  viewMode: 'list' | 'grid';
}

export default function TodoList({ todos, onUpdate, onDelete, viewMode, loading }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onUpdate(id, { title: editText });
    }
    cancelEdit();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.title}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {editingId === todo.id ? (
                <>
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onUpdate(todo.id, { priority: todo.priority === 1 ? 0 : 1 })}
                    className={`px-3 py-1 ${
                      todo.priority === 1
                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } rounded`}
                  >
                    <Star
                      className="h-5 w-5"
                      fill={todo.priority === 1 ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    onClick={() => startEdit(todo)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {todos?.map((todo) => (
        <div
          key={todo.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdate(todo.id, { priority: todo.priority === 1 ? 0 : 1 })}
                className={`px-3 py-1 ${
                  todo.priority === 1
                    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } rounded`}
              >
                <Star className="h-5 w-5" fill={todo.priority === 1 ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => startEdit(todo)}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          {editingId === todo.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>{todo.title}</p>
          )}
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
