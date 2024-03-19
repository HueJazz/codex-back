import LibraryModel from "../models/LibraryModel.js"
import BookModel from "../models/BookModel.js"

export const getLibrary = async (req, res) => {
    try {

        const userId = req.userId
        
        const library = await LibraryModel.findOne({
            userId
        });

        res.json(library);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to load library"
        })
    }
}

export const addToLibrary = async (req, res) => {
    try {

        const bookId = req.params.bookId

        const book = await BookModel.findOne(
            { 
                _id: bookId 
            })

        let library = await LibraryModel.findOne(
            { 
                userId: req.userId 
            });

        if (!library) {
            library = new LibraryModel({
                userId: req.userId,
                books: [book],
            });
        } else {
            library.books = [book, ...library.books];
        }

        library = await library.save();

        res.json(book);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to add book"
        })
    }
}

export const removeFromLibrary = async (req, res) => {
    try {

        const bookId = req.params.bookId

        let library = await LibraryModel.findOne(
            { 
                userId: req.userId 
            });

        if (!library) {
            return res.status(400).json({
                message: "Library not found",
            });
        }

        const bookIndex = library.books.findIndex(existingBook => existingBook._id.equals(bookId));

        if (bookIndex === -1) {
            return res.status(400).json({
                message: "Book not found in the library",
            });
        }

        library.books.splice(bookIndex, 1);

        library = await library.save();

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to delete book"
        })
    }
}