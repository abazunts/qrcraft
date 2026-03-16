import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGODB_URI;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  // During build without env vars; the rejected promise is never awaited
  const rejected = Promise.reject<MongoClient>(
    new Error("Please add MONGODB_URI to .env.local")
  );
  // Suppress unhandled rejection warning at build time
  rejected.catch(() => undefined);
  clientPromise = rejected;
}

export default clientPromise;
