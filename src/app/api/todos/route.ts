import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TaskStatus } from '@prisma/client';
import { TodosResponse, WhereClause, Todo } from '@/types/todo';
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

// Helper function to handle Redis operations with fallback
interface CacheData {
  todos: Todo[];
  total: number;
  page: number;
  totalPages: number;
}

const getCachedData = async (key: string): Promise<string | null> => {
  try {
    return await redis.get(key);
  } catch (error) {
    console.warn('Redis error:', error);
    return null;
  }
};

const setCachedData = async (key: string, data: CacheData, expireTime = 60): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', expireTime);
  } catch (error) {
    console.warn('Redis error:', error);
  }
};

// Validate request parameters
const validateRequestParams = (params: URLSearchParams): { page: number; limit: number } => {
  const page = Math.max(1, parseInt(params.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(params.get('limit') || '10')));
  const priority = params.get('priority');

  if (priority && isNaN(parseInt(priority))) {
    throw new Error('Invalid priority value');
  }

  return { page, limit };
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = validateRequestParams(searchParams);
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

    // Try to get from cache with fallback
    const cacheKey = `todos:${page}:${limit}:${search}:${statusParam}:${priority}`;
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // Use transaction for consistent reads
    const result = await prisma.$transaction(async (tx) => {
      const [todos, total] = await Promise.all([
        tx.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: 'desc' },
        }),
        tx.task.count({ where }),
      ]);
      return { todos, total };
    });

    const { todos, total } = result;
    const totalPages = Math.ceil(total / limit);
    const response: TodosResponse = {
      todos,
      total,
      page,
      totalPages,
    };

    // Cache with shorter expiration for frequently changing data
    await setCachedData(cacheKey, response, 30);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/todos:', error);

    if (error instanceof Error) {
      if (error.message === 'Invalid priority value') {
        return NextResponse.json({ error: 'Invalid priority parameter' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
        status: status && isValidTaskStatus(status) ? status : 'PENDING',
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
        ...(status && isValidTaskStatus(status) ? { status } : {}),
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
