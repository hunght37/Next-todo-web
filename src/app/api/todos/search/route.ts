import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

interface TodoFilter {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  completed?: boolean;
  priority?: string;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await dbConnect();

    // Build filter object
    const filter: TodoFilter = {};

    // Text search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      filter.completed = status === 'completed';
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Get total count for pagination
    const total = await Todo.countDocuments(filter);

    // Get filtered and paginated todos
    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const transformedTodos = todos.map((todo) => ({
      ...todo.toObject(),
      id: todo._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({
      todos: transformedTodos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Failed to search todos',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
