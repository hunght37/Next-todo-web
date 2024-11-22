import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const todo = await Todo.findById(params.id);
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const transformedTodo = {
      ...todo.toObject(),
      id: todo._id.toString(),
      _id: undefined,
    };
    return NextResponse.json(transformedTodo);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const body = await request.json();
    await dbConnect();
    const todo = await Todo.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const transformedTodo = {
      ...todo.toObject(),
      id: todo._id.toString(),
      _id: undefined,
    };
    return NextResponse.json(transformedTodo);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const todo = await Todo.findByIdAndDelete(params.id);
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
