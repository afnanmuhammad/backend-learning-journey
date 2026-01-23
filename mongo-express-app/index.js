import express from 'express';
import path from 'path';
import { connectStoreDB } from './dbConnectionAdv.js';
import { ObjectId } from 'mongodb';

const app = express();

// parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'view'));

// DB connection
let db;
const initDB = async () => {
  db = await connectStoreDB();
};
await initDB();

// Students list
app.get('/', async (req, res) => {
  const students = await db.collection('students').find().toArray();
  res.render('students', { students });
});

// Add form
app.get('/add', (req, res) => {
  res.render('addStudents');
});

// Add student
app.post('/add-student', async (req, res) => {
  const { name, age, email } = req.body;
  await db.collection('students').insertOne({ name, age, email });
  res.redirect('/');
});

// Delete student
app.post('/delete-student', async (req, res) => {
  await db.collection('students').deleteOne({
    _id: new ObjectId(req.body.id),
  });
  res.redirect('/');
});

// API
app.get('/api', async (req, res) => {
  const students = await db.collection('students').find().toArray();
  res.json(students);
});

// server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
