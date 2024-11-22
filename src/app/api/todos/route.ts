import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TaskStatus } from '@prisma/client';
import { TodosResponse, WhereClause } from '@/types/todo';
import { getRedisClient } from '@/lib/redis';

const prisma = new PrismaClient();
const redis = getRedisClient();

// Helper function to validate TaskStatus
const isValidTaskStatus = (status: string): status is TaskStatus => {
  return Object.values(TaskStatus).includes(status as TaskStatus);
};

// Helper function to invalidate cache
const invalidateCache = async (): Promise<void> => {
  const keys = await redis.keys('todos:*');
  if (keys.length > 0) {
    await redis.del(keys);
  }
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const statusParam = searchParams.get('status');
    const priority = searchParams.get('priority');

    const skip = (page - 1) * limit;

    // Build where clause based on search params
    const where: WhereClause = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statusParam && isValidTaskStatus(statusParam)) {
      where.status = statusParam;
    }
    if (priority) {
      where.priority = parseInt(priority);
    }

    // Try to get from cache first
    const cacheKey = `todos:${page}:${limit}:${search}:${statusParam}:${priority}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from database
    const [todos, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    const response: TodosResponse = {
      todos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    // Cache the response
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60); // Cache for 60 seconds

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { title, description, status, priority } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Validate status if provided
    if (status && !isValidTaskStatus(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const todo = await prisma.task.create({
      data: {
        title,
        description,
        status: status && isValidTaskStatus(status) ? status : TaskStatus.PENDING,
        priority: priority ?? 0,
      },
    });

    // Invalidate cache
    await invalidateCache();

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { id, title, description, status, priority } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }

    // Validate status if provided
    if (status && !isValidTaskStatus(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const todo = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status: status && isValidTaskStatus(status) ? status : undefined,
        priority,
      },
    });

    // Invalidate cache
    await invalidateCache();

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id },
    });

    // Invalidate cache
    await invalidateCache();

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
