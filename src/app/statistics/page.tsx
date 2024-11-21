'use client';

import TaskStatistics from '@/components/TaskStatistics';
import { TodoContext } from '@/context/TodoContext';
import { useContext } from 'react';

export default function StatisticsPage() {
  const { tasks } = useContext(TodoContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Task Statistics</h1>
      <TaskStatistics tasks={tasks} />
    </div>
  );
}
