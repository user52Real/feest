// src/app/lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

async function createIndexes(client: MongoClient) {
  try {
    const db = client.db('feest');
    
    // Create indexes for the messages collection
    await db.collection('event_messages').createIndexes([
      { key: { eventId: 1, timestamp: 1 } },
      { key: { senderId: 1 } }
    ]);

    // Create indexes for other collections if needed
    await db.collection('events').createIndexes([
      { key: { userId: 1 } },
      { key: { 'guests.email': 1 } }
    ]);

    console.log('MongoDB indexes created successfully');
  } catch (error) {
    console.error('Error creating MongoDB indexes:', error);
  }
}

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().then(async (client) => {
      // Create indexes when the connection is established
      await createIndexes(client);
      return client;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then(async (client) => {
    // Create indexes when the connection is established
    await createIndexes(client);
    return client;
  });
}

export default clientPromise;