import express from 'express';
import { MongoClient } from 'mongodb';

// MongoDB connection URL
const MONGO_URL = 'mongodb://localhost:27017';

// Database name
const DATABASE_NAME = 'school';

// Create MongoDB client
const mongoClient = new MongoClient(MONGO_URL);

// Function to connect MongoDB and fetch students
const connectToDatabase = async () => {
  try {
    // Connect to MongoDB server
    await mongoClient.connect();
    console.log(' MongoDB connected successfully');

    // Select database
    const database = mongoClient.db(DATABASE_NAME);

    // Select collection
    const studentsCollection = database.collection('students');

    // Fetch all students
    const studentsList = await studentsCollection.find({}).toArray();

    // Print students data
    console.log(' Students Data:', studentsList);

  } catch (error) {
    console.error(' MongoDB connection error:', error);
  }
};

// Call database connection function
connectToDatabase();

// Create Express application
const app = express();

// Start Express server
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000');
});
