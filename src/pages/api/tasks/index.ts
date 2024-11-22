import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const tasks = await prisma.task.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(tasks);
      }

      case 'POST': {
        const { title, description } = req.body;

        if (!title) {
          return res.status(400).json({ message: 'Title is required' });
        }

        const task = await prisma.task.create({
          data: {
            title,
            description: description || '',
          },
        });

        return res.status(201).json(task);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
