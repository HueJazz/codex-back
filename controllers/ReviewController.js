import ReviewModel from "../models/ReviewModel.js"
import UserModel from "../models/UserModel.js"

export const getAll = async (req, res) => {
    try {
        const bookId = req.params.bookId

        const reviews = await ReviewModel.find({ bookId });

        res.json(reviews);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get reviews"
        })
    }
}

export const create = async (req, res) => {
    try {
        const bookId = req.params.bookId

        const userData = await UserModel.findOne({ _id: req.userId })

        const userName = userData.userName;

        const doc = new ReviewModel({
            bookId,
            userId: req.userId,
            userName,
            text: req.body.text,
            rating: req.body.rating,
        })

         const review = await doc.save()

         res.json(review)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to create review"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const doc = await ReviewModel.findOneAndDelete(
            { 
                _id: reviewId 
            });

        if (!doc) {
            return res.status(400).json({
                message: "Review not found"
            });
        }

        res.json({
            success: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to delete review"
        });
    }
};

export const update = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const updateResult = await ReviewModel.updateOne(
            { 
                _id: reviewId
            },
            {
                userId: req.userId,
                text: req.body.text,
                rating: req.body.rating,
            }
        ).exec();

        res.json(updateResult);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to update review"
        });
    }
};