// import express from 'express';
// import path from 'path';
// import { MongoClient } from 'mongodb';

// //........ MongoDB connection URL
// const MONGO_URL = 'mongodb://localhost:27017';

// //........ Database name
// const DATABASE_NAME = 'school';

// //........ Create MongoDB client
// const mongoClient = new MongoClient(MONGO_URL);

// // -----------------------------------------------------------------

// //Connect to MongoDB and fetch students

// // Function to connect MongoDB and fetch students
// // const connectToDatabase = async () => {
// //   try {
// //     //........ Connect to MongoDB server
// //     await mongoClient.connect();
// //     console.log(' MongoDB connected successfully');

// //     //........ Select database
// //     const database = mongoClient.db(DATABASE_NAME);

// //     //........ Select collection
// //     const studentsCollection = database.collection('students');

// //     // ........Fetch all students
// //     const studentsList = await studentsCollection.find({}).toArray();

// //     //........ Print students data
// //     console.log(' Students Data:', studentsList);

// //   } catch (error) {
// //     console.error(' MongoDB connection error:', error);
// //   }
// // };

// // //........ Call database connection function
// // connectToDatabase();

// //........ Create Express application
// // --------------------------------------------------------------------------
// const app = express();

// //........ Set EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('view', path.join(process.cwd(), 'view'));

// //........ Define a simple route
// app.get('/',async (req, res) => {

//  try {
//     //........ Connect to MongoDB server
//     await mongoClient.connect();
//     console.log(' MongoDB connected successfully');

//     //........ Select database
//     const database = mongoClient.db(DATABASE_NAME);

//     // Select collection
//     const studentsCollection = database.collection('students');

//     //........ Fetch all students
//     const studentsList = await studentsCollection.find({}).toArray();

//     //........ Print students data
//     console.log(' Students Data:', studentsList);

//     res.render('students', { students: studentsList });
//   } catch (error) {
//     console.error(' MongoDB connection error:', error);
//   }

// });

// // ........Start Express server
// app.listen(3000, () => {
//   console.log('🚀 Server is running on http://localhost:3000');
// });

// --------------------------------------------------------------------------

import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';
import { connectStoreDB } from './dbConnectionAdv.js';

const app = express();

// ---------- MongoDB ----------
const MONGO_URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'school';
const mongoClient = new MongoClient(MONGO_URL);

// ---------- View Engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

//--------------------- DB single connection-------------------------
let db;
const initDB = async () => {
  db = await connectStoreDB();
};
await initDB(); //  Ensure db is ready before routes

// ---------- Route 1 (OLD - EJS students) ----------
app.get('/', async (req, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const students = await db.collection('students').find({}).toArray();

    res.render('students', { students });
  } catch (error) {
    console.error(error);
    res.send('Error loading students');
  }
});

// ---------- Route 2 (NEW - API JSON) ----------
app.get('/api', async (req, res) => {
  try {
    const students = await db.collection('students').find({}).toArray();
    res.json(students); //  JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// ---------- Server ----------
app.listen(3000, () => {
  console.log(' Server running on http://localhost:3000');
});
