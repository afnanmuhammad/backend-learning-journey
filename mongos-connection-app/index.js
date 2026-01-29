import express from "express";
import mongoose from "mongoose";
import Student from './models/student.model.js';
import nodemailer from "nodemailer";// Import nodemailer for email functionality
const port = 5000;


const app = express();
app.use(express.json());// Middleware to parse JSON request bodies  


// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service:'gmail',// using gmail
  auth:{// authentication
    user:'example@gmail.com',// your email id
    pass:'yourpassword' // your password
  }
})



// MongoDB connection
const MONGO_URL = "mongodb://localhost:27017/school";

mongoose
  .connect(MONGO_URL)// Connect to MongoDB
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
    const savedStudent = await newStudent.save();// Save to database
    res.status(201).json(savedStudent);// Respond with the saved student
  } catch (err) {
    res.status(400).json({ error: err.message });// Handle errors
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();// Fetch all students from database
    res.json(students);// Respond with the list of students
  } catch (err) {
    res.status(500).json({ error: err.message });// Handle errors
  }
});



//----------------------------Email sending testing -----------------------------
app.set("view engine","ejs");// set the view engine to ejs
app.set("views","./view");// set the views directory
app.use(express.urlencoded({extended:false}));// Middleware to parse URL-encoded request bodies




// Render the email form
app.get("/email",(req,res)=>{
  res.render("email");
});

// Handle form submission
app.post("/subscribe", (req, res) => {
  const { email, message } = req.body;// Get email and message from the form

 // Set up email data
  const mailOptions = {
    from: 'example@gmail.com',   
    to: email,                            
    subject: "Welcome to Our Service",    
    text: message                         
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email error:", error);
      res.send("Email failed");
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully");
    }
  });
});


//port running on localhost:5000
app.listen(port, () => {
  console.log(" Server is running on port 3000");
});
