import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    books: {
        type: Array,
        required: true,
    }
})
  
  export default mongoose.model('Library', librarySchema)