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
import { Bar, Doughnut } from 'react-chartjs-2';
import { Task } from '@/types/task';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
}

export default function TaskStatistics({ tasks }: { tasks: Task[] }) {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
  });

  useEffect(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    const inProgress = total - completed;

    setStats({
      total,
      completed,
      inProgress,
    });
  }, [tasks]);

  const barData = {
    labels: ['Total Tasks', 'Completed', 'In Progress'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [stats.total, stats.completed, stats.inProgress],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Completed', 'In Progress'],
    datasets: [
      {
        data: [stats.completed, stats.inProgress],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Task Statistics',
        color: 'white',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Task Completion Rate',
        color: 'white',
      },
    },
  };

  return (
    <div className="w-full p-6 rounded-lg bg-opacity-20 bg-white backdrop-blur-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-opacity-30 bg-black p-4 rounded-lg">
          <Bar options={options} data={barData} />
        </div>
        <div className="bg-opacity-30 bg-black p-4 rounded-lg">
          <Doughnut options={doughnutOptions} data={doughnutData} />
        </div>
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <div className="bg-opacity-30 bg-black p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold text-blue-300">Total Tasks</h3>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-opacity-30 bg-black p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold text-teal-300">Completed</h3>
            <p className="text-3xl font-bold text-white">{stats.completed}</p>
          </div>
          <div className="bg-opacity-30 bg-black p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold text-yellow-300">In Progress</h3>
            <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
