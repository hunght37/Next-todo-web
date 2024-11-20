import { SubTask as SubTaskType } from '@/types/todo';
import { TrashIcon } from '@heroicons/react/24/outline';

interface SubTaskProps {
  subtask: SubTaskType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SubTask({ subtask, onToggle, onDelete }: SubTaskProps) {
  return (
    <div className="flex items-center gap-2 pl-8 py-2">
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={() => onToggle(subtask.id)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
        {subtask.title}
      </span>
      <button
        onClick={() => onDelete(subtask.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
