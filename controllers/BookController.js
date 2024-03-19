import BookModel from "../models/BookModel.js"
import GenreModel from "../models/GenreModel.js"

export const getBook = async (req, res) => {
    try {

        const bookId = req.params.id

        const bookResult = await BookModel.findOne({ _id: bookId })

        if (!bookResult) {
            return res.status(400).json({
                message: "Book not found"
            });
        }

        res.json(bookResult);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get a book"
        })
    }
}

export const getSpotlight = async (req, res) => {
    try {

        const genreName = req.params.genre

        const spotlight = await BookModel.findOne(
            { 
                genre: { $regex: genreName, $options: 'i' }
            })
            .sort({ rating: -1 })
            .exec();
            
        if (!spotlight) {
            return res.status(400).json({
                message: "Book not found"
            });
        }

        res.json(spotlight);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get a book"
        })
    }
}

export const getCollection = async (req, res) => {
    try {

        const bookGenre = req.params.genre
        let maxResults = parseInt(req.query.maxResults)

        const booksResult = await BookModel.find({ genre: { $regex: new RegExp(bookGenre, 'i') } })
            .limit(maxResults);

        if (!booksResult) {
            return res.status(400).json({
                message: "Books not found for the specified genre"
            });
        }

        res.json(booksResult);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get books for the specified genre"
        })
    }
}

export const getTop = async (req, res) => {
    try {
        let maxResults = parseInt(req.query.maxResults) || 20;

        const booksResult = await BookModel.find()
            .sort({ rating: -1 })
            .limit(maxResults)
            .exec();

        if (!booksResult) {
            return res.status(400).json({
                message: "Books not found for the specified genre"
            });
        }

        res.json(booksResult);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get books for the specified genre"
        })
    }
}

export const getGenreTop = async (req, res) => {
    try {
        const bookGenre = req.params.genre
        let maxResults = parseInt(req.query.maxResults)

        const booksResult = await BookModel.find({ genre: { $regex: new RegExp(bookGenre, 'i') } })
            .sort({ rating: -1 })
            .limit(maxResults)
            .exec();

        if (!booksResult) {
            return res.status(400).json({
                message: "Books not found for the specified genre"
            });
        }

        res.json(booksResult);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get books for the specified genre"
        })
    }
}

export const searchResult = async (req, res) => {
    try {
        const searchInput = req.params.item
        const sortBy = req.query.sortBy
        const maxResults = req.query.maxResults

        let result

        if (sortBy === 'all') {
            result = await BookModel.find({
                $or: [
                  { author: { $regex: new RegExp(`${searchInput}`, 'i') } },
                  { genre: { $regex: new RegExp(`${searchInput}`, 'i') } },
                  { title: { $regex: new RegExp(`${searchInput}`, 'i') } },
                ]})
                    .limit(maxResults);
        } else {   
            result = await BookModel.find({
                [sortBy]: { $regex: new RegExp(`${searchInput}`, 'i') } })
                    .limit(maxResults);
        }

        if (!result) {
            return res.status(400).json({
                message: "Books not found for the specified genre"
            });
        }

        res.json(result);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get books for the specified genre"
        })
    }
}

export const searchSuggestions = async (req, res) => {
    try {
        const searchInput = req.params.item
        const sortBy = req.query.sortBy
        const maxResults = req.query.maxResults
        const maxGenres = 2

        let suggestionsBooks, suggestionsGenres

        if (sortBy === 'all') {
            suggestionsGenres = await GenreModel.find({
                name: { $regex: new RegExp(`^${searchInput}`, 'i') }
            }).sort({ count: -1 }).limit(maxGenres);
            suggestionsBooks = await BookModel.find({
                title: { $regex: new RegExp(`^${searchInput}`, 'i') }
            }).sort({ rating: -1 }).limit(maxResults - suggestionsGenres.length);

        } else if (sortBy === 'title') { 
            suggestionsBooks = await BookModel.find({
                title: { $regex: new RegExp(`^${searchInput}`, 'i') }
            }).sort({ rating: -1 }).limit(maxResults);
            suggestionsBooks = []

        } else if (sortBy === 'genre') { 
            suggestionsGenres = await GenreModel.find({
                name : { $regex: new RegExp(`^${searchInput}`, 'i') } 
            }).sort({ count: -1 }).limit(maxResults);  
            suggestionsBooks = []
        }

        if (!suggestionsBooks && !suggestionsGenres) {
            return res.status(400).json({
                message: "Books not found"
            });
        }

        res.json({books: suggestionsBooks, genres: suggestionsGenres});

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get books for the specified genre"
        })
    }
}