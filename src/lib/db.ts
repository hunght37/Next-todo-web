import mongoose from 'mongoose';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: MongooseConnection | undefined;
}

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
}

const cached: MongooseConnection = global.mongooseConnection ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Since we check for MONGODB_URI at the top level, we can safely assert it's defined here
    cached.promise = mongoose.connect(MONGODB_URI!);
  }

  try {
    const mongoose = await cached.promise;
    cached.conn = mongoose;
    return mongoose;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
