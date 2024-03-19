import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
    listName : {
        type: 'String',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: {
        type: 'String',
        required: true,
    }, 
    isPrivate: {
        type: Boolean,
        required: true,
    },
    books: {
        type: Array,
        required: false,
    }
}, 
  {
    timestamps: true,
  }
)
  
  export default mongoose.model('List', listSchema)