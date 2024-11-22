import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();

    // Tạo một task test
    const testTodo = await Todo.create({
      title: 'Test Task',
      description: 'This is a test task',
      completed: false,
    });

    // Lấy task vừa tạo
    const retrievedTodo = await Todo.findById(testTodo._id);

    return NextResponse.json({
      message: 'Test successful',
      created: testTodo,
      retrieved: retrievedTodo,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
