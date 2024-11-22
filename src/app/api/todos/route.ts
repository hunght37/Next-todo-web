import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

export async function GET() {
  try {
    await dbConnect();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    // Chuyển đổi _id thành id
    const transformedTodos = todos.map(todo => ({
      ...todo.toObject(),
      id: todo._id.toString(),
      _id: undefined
    }));
    return NextResponse.json(transformedTodos);
  } catch (error: any) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch todos',
      details: error?.message 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating todo with body:', body);

    await dbConnect();
    const todo = await Todo.create({
      ...body,
      subtasks: body.subtasks || [],
      priority: body.priority || 'medium',
      deadline: body.deadline || '',
      description: body.description || ''
    });

    // Chuyển đổi _id thành id
    const transformedTodo = {
      ...todo.toObject(),
      id: todo._id.toString(),
      _id: undefined
    };

    console.log('Created todo:', transformedTodo);
    return NextResponse.json(transformedTodo, { status: 201 });
  } catch (error: any) {
    console.error('Error creating todo:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Validation Error',
        details: Object.values(error.errors).map((err: any) => err.message)
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create todo',
      details: error?.message 
    }, { status: 500 });
  }
}