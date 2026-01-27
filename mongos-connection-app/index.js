import express from "express";
import mongoose from "mongoose";
import Student from './models/student.model.js';

const port = 3000;


const app = express();
app.use(express.json());

// MongoDB connection
const MONGO_URL = "mongodb://localhost:27017/school";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(" Connected to MongoDB");
  })
  .catch((error) => {
    console.error(" Error connecting to MongoDB:", error);
  });



// Routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Create a new student
app.post('/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body); // req.body should have name, age, grade
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(port, () => {
  console.log(" Server is running on port 3000");
});
