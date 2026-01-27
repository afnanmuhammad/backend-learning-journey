import mongoose from "mongoose";

 // Define the Student schema
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Student's name
    age: { type: Number, required: true }, // Student's age
    grade: { type: String, required: true }    // Student's grade
});

// Create the Student model
const Student = mongoose.model('Student', StudentSchema); 

// Export the Student model
export default Student;