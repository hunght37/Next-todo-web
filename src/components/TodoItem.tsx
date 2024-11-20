import { useState } from 'react';
import { Todo, Priority } from '@/types/todo';
import { TrashIcon, PencilIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon } from '@heroicons/react/24/outline';
import SubTaskComponent from './SubTask';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onAddSubtask: (todoId: string, subtaskTitle: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const [editedDeadline, setEditedDeadline] = useState(todo.deadline || '');
  const [editedPriority, setEditedPriority] = useState<Priority>(todo.priority);
  const [newSubtask, setNewSubtask] = useState('');

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editedTitle,
      description: editedDescription,
      deadline: editedDeadline,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(todo.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
          
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
          ) : (
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
          )}

          <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[todo.priority]}`}>
            {todo.priority}
          </span>

          {todo.deadline && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(todo.deadline).toLocaleDateString()}
            </span>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="mt-1 w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editedDeadline}
                    onChange={(e) => setEditedDeadline(e.target.value)}
                    className="mt-1 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <select
                    value={editedPriority}
                    onChange={(e) => setEditedPriority(e.target.value as Priority)}
                    className="mt-1 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                {todo.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {todo.description}
                  </p>
                )}
              </>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtasks</h4>
              {todo.subtasks.map((subtask) => (
                <SubTaskComponent
                  key={subtask.id}
                  subtask={subtask}
                  onToggle={(subtaskId) => onToggleSubtask(todo.id, subtaskId)}
                  onDelete={(subtaskId) => onDeleteSubtask(todo.id, subtaskId)}
                />
              ))}
              
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask"
                  className="flex-1 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
