import ListModel from "../models/ListModel.js"
import BookModel from "../models/BookModel.js"
import UserModel from "../models/UserModel.js";

export const getLists = async (req, res) => {
    try {

        const userId = req.params.userId
        
        const lists = await ListModel.find(
            { 
                userId 
            });

        res.json(lists.reverse());

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to load lists"
        })
    }
}

export const getList = async (req, res) => {
    try {

        const listId = req.params.listId
        
        const list = await ListModel.findOne(
            { 
                _id: listId 
            });

        res.json(list);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to load lists"
        })
    }
}

export const createList = async (req, res) => {
    try {

        const listName = req.params.listName
        let isPrivate = req.query.isPrivate;
        const userId = req.userId

        isPrivate = isPrivate === 'true';

        const user = await UserModel.findOne(
            {
                _id: userId
            })

        let list = new ListModel({
            listName,
            userId,
            userName: user.userName,
            isPrivate,
            books: [],
        });

        list = await list.save();

        res.json(list);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to create list"
        })
    }
}

export const deleteList = async (req, res) => {
    try {

        const listId = req.params.listId

        const list = await ListModel.findOneAndDelete(
            { 
                _id: listId 
            });

        if (!list) {
            return res.status(400).json({
                message: "List not found",
            });
        }

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to delete list"
        })
    }
}

export const addToList = async (req, res) => {
    try {

        const bookId = req.params.bookId
        const listId = req.params.listId

        const book = await BookModel.findOne(
            { 
                _id: bookId 
            })

        let list = await ListModel.findOne(
            { 
                _id: listId
            });

        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }
        
        if(!list.books) {
            list.books = book
        } else {
            list.books = [book, ...list.books];
        }

        list = await list.save();

        res.json(list);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to add book"
        })
    }
}

export const removeFromList = async (req, res) => {
    try {

        const bookId = req.params.bookId
        const listId = req.params.listId

        let list = await ListModel.findOne(
            { 
                _id: listId
            });

        if (!list) {
            return res.status(400).json({
                message: "List not found",
            });
        }

        const bookIndex = list.books.findIndex(existingBook => existingBook._id.equals(bookId));

        if (bookIndex === -1) {
            return res.status(400).json({
                message: "Book not found in the list",
            });
        }

        list.books.splice(bookIndex, 1);

        list = await list.save();

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