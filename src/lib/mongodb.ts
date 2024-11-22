import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

const cachedGlobal: MongooseConnection = globalThis.mongoose || {
  conn: null,
  promise: null,
};

globalThis.mongoose = cachedGlobal;

async function dbConnect(): Promise<typeof mongoose> {
  if (cachedGlobal.conn) {
    return cachedGlobal.conn;
  }

  if (!cachedGlobal.promise) {
    const opts = {
      bufferCommands: false,
    };

    cachedGlobal.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cachedGlobal.conn = await cachedGlobal.promise;
    return cachedGlobal.conn;
  } catch (e) {
    cachedGlobal.promise = null;
    throw e;
  }
}

export default dbConnect;
