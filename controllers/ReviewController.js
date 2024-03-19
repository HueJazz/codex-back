import ReviewModel from "../models/ReviewModel.js"
import UserModel from "../models/UserModel.js"
import BookModel from "../models/BookModel.js"

export const getReviews = async (req, res) => {
    try {
        const bookId = req.params.bookId

        const reviews = await ReviewModel.find(
            { 
                bookId 
            });

        res.json(reviews);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get reviews"
        })
    }
}

export const getUserReviews = async (req, res) => {
    try {
        const userId = req.params.userId

        const reviews = await ReviewModel.find(
            { 
                userId 
            });

        res.json(reviews);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get reviews"
        })
    }
}

export const createReview = async (req, res) => {
    try {
        const bookId = req.params.bookId

        const userData = await UserModel.findOne({ _id: req.userId })

        const bookData = await BookModel.findOne({ _id: bookId })

        const doc = new ReviewModel({
            bookId,
            bookInfo: {
                bookImage: bookData.img,
                bookTitle: bookData.title,
                bookAuthor: bookData.author,
            },
            userId : req.userId,
            userInfo: {
                userName: userData.userName,
                userCreatedAt: userData.createdAt,
            },
            text: req.body.text,
            rating: req.body.rating,
            likes: [],
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

export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await ReviewModel.findOneAndDelete(
            { 
                _id: reviewId 
            });

        if (!review) {
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

export const updateReview = async (req, res) => {
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

export const toggleLikeReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.userId;

        const review = await ReviewModel.findOne({ _id: reviewId });

        const index = review.likes.indexOf(userId);
        
        if (index === -1) {
            review.likes.push(userId);
        } else {
            review.likes.splice(index, 1);
        }

        await review.save();
        
        res.json(review.likes);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to toggle like for review"
        });
    }
};

export const commentReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.userId;

        const review = await ReviewModel.findOne({ _id: reviewId });
        
        review.comments.push({
            userId,
            text: req.body.text,
        })

        await review.save();
        
        res.json(review.comments);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to toggle like for review"
        });
    }
};