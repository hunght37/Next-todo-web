import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(task);

      case 'PUT':
        const updatedTask = await prisma.task.update({
          where: { id },
          data: {
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed
          }
        });
        return res.status(200).json(updatedTask);

      case 'DELETE':
        await prisma.task.delete({
          where: { id }
        });
        return res.status(204).end();

      case 'PATCH':
        if (req.url?.endsWith('/toggle')) {
          const toggledTask = await prisma.task.update({
            where: { id },
            data: {
              completed: !task.completed
            }
          });
          return res.status(200).json(toggledTask);
        }
        return res.status(400).json({ error: 'Invalid PATCH operation' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'PATCH']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
