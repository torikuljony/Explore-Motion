import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  const client = await globalForMongo._mongoClientPromise;
  return client.db(process.env.MONGODB_DB);
}