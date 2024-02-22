import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model("Books", bookSchema, "books")