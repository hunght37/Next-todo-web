import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';
import type { Todo as TodoInterface } from '@/types/todo';

export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();
    const todos = await Todo.find({}).sort({ createdAt: -1 });

    const transformedTodos = todos.map((todo) => ({
      ...todo.toObject(),
      id: todo._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(transformedTodos);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Failed to fetch todos',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Omit<TodoInterface, 'id'>;
    await dbConnect();

    const todo = await Todo.create({
      ...body,
      subtasks: body.subtasks || [],
      priority: body.priority || 'medium',
      deadline: body.deadline || null,
    });

    const transformedTodo = {
      ...todo.toObject(),
      id: todo._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(transformedTodo, { status: 201 });
  } catch (error: unknown) {
    // Check for validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation Error',
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create todo',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
