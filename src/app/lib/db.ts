import clientPromise from './mongodb';
import { Event } from '../types/events';
import { ObjectId } from 'mongodb';

export async function getEvents(userId: string) {
  const client = await clientPromise;
  const db = client.db('feest');
  
  return db.collection('events')
    .find({ organizer: userId })
    .sort({ date: 1, time: 1 })
    .toArray();
}

export async function getEvent(eventId: string) {
  const client = await clientPromise;
  const db = client.db('feest');
  
  return db.collection('events')
    .findOne({ _id: new ObjectId(eventId) });
}

export async function updateEvent(eventId: string, data: Partial<Event>) {
  const client = await clientPromise;
  const db = client.db('feest');
  
  return db.collection('events')
    .updateOne(
      { _id: new ObjectId(eventId) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    );
}

export async function deleteEvent(eventId: string) {
  const client = await clientPromise;
  const db = client.db('feest');
  
  return db.collection('events')
    .deleteOne({ _id: new ObjectId(eventId) });
}