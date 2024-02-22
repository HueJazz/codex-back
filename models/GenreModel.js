import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model("Genres", genreSchema, "genres")