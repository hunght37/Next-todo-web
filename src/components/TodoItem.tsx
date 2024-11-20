import { useState, useRef, useEffect } from 'react';
import { Todo, Priority } from '@/types/todo';
import { TrashIcon, PencilIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

const priorityLabels: Record<Priority, string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
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
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Reset form when canceling edit
  const handleCancelEdit = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description || '');
    setEditedDeadline(todo.deadline || '');
    setEditedPriority(todo.priority);
    setIsEditing(false);
  };

  // Focus title input when entering edit mode
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!editedTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    onUpdate(todo.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-200">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={isExpanded ? 'Collapse task' : 'Expand task'}
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
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Task title"
            />
          ) : (
            <span 
              className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
              title={todo.description || todo.title}
            >
              {todo.title}
            </span>
          )}

          <span 
            className={`px-2 py-1 rounded-full text-xs ${priorityColors[todo.priority]}`}
            title={priorityLabels[todo.priority]}
          >
            {todo.priority}
          </span>

          {todo.deadline && (
            <span 
              className={`text-sm ${
                new Date(todo.deadline) < new Date() ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}
              title={`Deadline: ${new Date(todo.deadline).toLocaleDateString()}`}
            >
              {new Date(todo.deadline).toLocaleDateString()}
            </span>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title={isEditing ? 'Cancel editing' : 'Edit task'}
          >
            {isEditing ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <PencilIcon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="mt-1 w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                    placeholder="Add a description (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={editedDeadline}
                      onChange={(e) => setEditedDeadline(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={editedPriority}
                      onChange={(e) => setEditedPriority(e.target.value as Priority)}
                      className="mt-1 w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {Object.entries(priorityLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                {todo.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
                    {todo.description}
                  </p>
                )}
              </>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subtasks ({todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length})
                </h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((todo.subtasks.filter(st => st.completed).length / todo.subtasks.length) * 100) || 0}% complete
                </div>
              </div>

              {todo.subtasks.length > 0 && (
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      style={{ width: `${(todo.subtasks.filter(st => st.completed).length / todo.subtasks.length) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {todo.subtasks.map((subtask) => (
                  <SubTaskComponent
                    key={subtask.id}
                    subtask={subtask}
                    onToggle={(subtaskId) => onToggleSubtask(todo.id, subtaskId)}
                    onDelete={(subtaskId) => onDeleteSubtask(todo.id, subtaskId)}
                  />
                ))}
              </div>
              
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
                  title="Add subtask"
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
