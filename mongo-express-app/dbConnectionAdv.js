
import { MongoClient } from 'mongodb';

const STORE_URL = 'mongodb://localhost:27017';
const STORE_NAME = 'school';
const storeClient = new MongoClient(STORE_URL);

export const connectStoreDB = async () => {
  try {
    await storeClient.connect();
    console.log('MongoDB connected successfully');
    return storeClient.db(STORE_NAME);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
