'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import type { Todo } from '@/types/todo';
import { CheckCircle, Clock, ListTodo } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function StatisticsContent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        if (!response.ok) throw new Error('Failed to fetch todos');
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const pendingTodos = todos.length - completedTodos;
  const completionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;

  const barData = {
    labels: ['Total Tasks', 'Completed', 'Pending'],
    datasets: [
      {
        label: 'Tasks',
        data: [todos.length, completedTodos, pendingTodos],
        backgroundColor: ['#60A5FA', '#34D399', '#F87171'],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTodos, pendingTodos],
        backgroundColor: ['#34D399', '#F87171'],
        borderWidth: 0,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Task Overview',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Task Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Statistics Dashboard</h1>
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ListTodo className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold">{todos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{completedTodos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Clock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{pendingTodos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4">Completion Rate</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-right mt-2 text-sm text-gray-500">
          {completionRate.toFixed(1)}% Complete
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}
