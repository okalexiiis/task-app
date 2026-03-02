import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://usuario_admin123:asfasfwer23435sfasf@tasks-ramses-utn-ok.dx8ozbh.mongodb.net/?appName=tasks-ramses-utn-ok";

if (!MONGODB_URI) {
  throw new Error("Define la variable MONGODB_URI en .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default dbConnect;
