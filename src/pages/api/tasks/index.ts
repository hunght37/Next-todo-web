import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all tasks
        const tasks = await prisma.task.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(tasks);

      case 'POST':
        // Create a new task
        const taskData: Prisma.TaskCreateInput = {
          title: req.body.title,
          description: req.body.description,
          completed: false,
        };
        
        const newTask = await prisma.task.create({
          data: taskData
        });
        return res.status(201).json(newTask);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
