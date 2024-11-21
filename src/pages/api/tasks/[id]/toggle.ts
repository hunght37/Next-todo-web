import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const task = await prisma.task.findUnique({
      where: { id: String(id) },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: String(id) },
      data: { completed: !task.completed },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
