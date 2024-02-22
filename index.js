import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors'

import { registerValidation, loginValidation, reviewCreateValidation } from "./validations.js";

import checkAuth from "./utils/checkAuth.js"
import handleValidationErrors from "./utils/handleValidationErrors.js"

import * as UserController from "./controllers/UserController.js";
import * as BookController from "./controllers/BookController.js"
import * as ReviewController from "./controllers/ReviewController.js"
import * as LibraryController from "./controllers/LibraryController.js"
import * as GenreController from "./controllers/GenreController.js"

const corsOptions = {
    origin: "http://localhost:3000"
  };

dotenv.config()

mongoose
    .connect(process.env.MONGO)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err))

const app = express()

app.use(express.json())
app.use(cors(corsOptions))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/books/:id', BookController.getBook)
app.get('/spotlight/:genre', BookController.getSpotlight)
app.get('/books/genres/:genre', BookController.getCollection)
app.get('/top', BookController.getTop)
app.get('/genres/:genre/top', BookController.getGenreTop)
app.get('/search/:item', BookController.searchResult)
app.get('/search/suggestion/:item', BookController.searchSuggestion)

app.get('/genres/', GenreController.getGenres)
app.get('/genres/:genreName', GenreController.getRelatedGenres)

app.get('/reviews/:bookId', ReviewController.getAll)
app.post('/reviews/:bookId', checkAuth, reviewCreateValidation, handleValidationErrors, ReviewController.create)
app.delete('/reviews/:reviewId', checkAuth, ReviewController.remove)

// app.patch('/reviews/:reviewId', checkAuth, handleValidationErrors, ReviewController.update)

app.get('/library', checkAuth, LibraryController.getLibrary)
app.post('/library/:bookId', checkAuth, LibraryController.addToLibrary)
app.delete('/library/:bookId', checkAuth, LibraryController.removeFromLibrary)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    } 

    console.log('Server OK')
});