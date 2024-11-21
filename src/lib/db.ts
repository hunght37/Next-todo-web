import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env');
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached: GlobalMongoose = (global as any).mongoose ?? {
  conn: null,
  promise: null,
};

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ...clientOptions
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("Successfully connected to MongoDB Atlas!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Error connecting to MongoDB Atlas:", e);
    throw e;
  }

  return cached.conn;
}

// Test the connection
async function testConnection() {
  try {
    const client = new MongoClient(MONGODB_URI!, clientOptions);
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    await client.close();
  } catch (error) {
    console.error("Error testing MongoDB connection:", error);
    throw error;
  }
}

// Run the test connection
testConnection().catch(console.dir);

export default dbConnect;
