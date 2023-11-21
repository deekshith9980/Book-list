import express from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import cors from "cors";

const app = express();

app.get('/', (req, res) => {
    console.log('req');
    return res.status(234).send('Welcome');
})

app.use(express.json());

app.use(cors());

app.post('/books', async(req, res) => {
    try {
        if(
            !req.body.title || !req.body.author || !req.body.publishYear
        ) {
            return res.status(400).send('Send all required fields');
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };
        const book = await Book.create(newBook);
        res.status(200).send('Book created');

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json({
            count: books.length,
            data: books
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

app.get('/books/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        res.status(200).json(book);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

app.put('/books/:id', async (req, res) => {
    try {
        if(
            !req.body.title || !req.body.author || !req.body.publishYear
        ) {
            return res.status(400).send('Send all required fields');
        }
        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body);
        if(!result) {
            res.status(404).send('Book not found');
        }
        res.status(200).send('Book successfully updated');

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

app.delete('/books/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result) {
            res.status(404).send('Book not found');
        }
        res.status(200).send('Book successfully deleted');

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`App listening on port: ${PORT}`);
        });
        
    })
    .catch((err) => {
        console.error(err);
    })
