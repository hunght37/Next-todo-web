import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET': {
        const task = await prisma.task.findUnique({
          where: { id: String(id) },
        });

        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json(task);
      }

      case 'PUT': {
        const { title, description } = req.body;

        const task = await prisma.task.findUnique({
          where: { id: String(id) },
        });

        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await prisma.task.update({
          where: { id: String(id) },
          data: {
            title,
            description,
          },
        });

        return res.status(200).json(updatedTask);
      }

      case 'DELETE': {
        const task = await prisma.task.findUnique({
          where: { id: String(id) },
        });

        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }

        await prisma.task.delete({
          where: { id: String(id) },
        });

        return res.status(204).end();
      }

      case 'PATCH':
        if (req.url?.endsWith('/toggle')) {
          const task = await prisma.task.findUnique({
            where: { id: String(id) },
          });

          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }

          const toggledTask = await prisma.task.update({
            where: { id: String(id) },
            data: {
              completed: !task.completed,
            },
          });
          return res.status(200).json(toggledTask);
        }
        return res.status(400).json({ error: 'Invalid PATCH operation' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'PATCH']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
