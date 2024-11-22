import type { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, todo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  return (
    <div className="mt-8 space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div>
              <h3
                className={`text-lg font-medium ${
                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && <p className="text-sm text-gray-500">{todo.description}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {todos.length === 0 && (
        <p className="text-center text-gray-500">No todos yet. Add one above!</p>
      )}
    </div>
  );
}
