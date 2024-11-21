import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await dbConnect();
    console.log("Successfully connected to MongoDB!");
    
    // Tạo một task test
    const testTodo = await Todo.create({
      title: "Test Task",
      description: "This is a test task",
      completed: false
    });

    console.log("Created test todo:", testTodo);

    // Lấy task vừa tạo
    const retrievedTodo = await Todo.findById(testTodo._id);
    
    return NextResponse.json({ 
      message: "Test successful",
      created: testTodo,
      retrieved: retrievedTodo
    });
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error,
      message: error.message 
    }, { status: 500 });
  }
}
