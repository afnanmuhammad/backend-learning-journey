require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err)); 



const booksSchema ={
    bookName: String,
    author: String,
    price: Number,
}

const booksModel = mongoose.model('books', booksSchema);

app.post('/books', async (req, res) => {
    try {
        const book = new booksModel(req.body);  
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/books', async(req, res) => {
    try{
        const books = await booksModel.find();
        res.status(200).json(books);
    }catch(error){
        res.status(500).json({ message: error.message });   
    }
    
});

app.get('/about/:id', async (req, res) => {
    try{
        const books = await booksModel.findById(req.params.id);
        res.status(200).json(books);
    }catch(error){
        res.status(500).json({ message: error.message });       
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});