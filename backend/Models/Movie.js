const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  movieId: { type: String, required: true, unique: true },
  description: { type: String },
  longDescription: {type: String},
  releaseDate: {type: String},
  director: {type: String},
  cast: {type: String},
  image: { type: String }, // Artwork
  videoUrl: { type: String },
  releaseDate: { type: Date },
  genre: { type: String }, // Genre
  trackPrice: { type: Number }, // Price
});

module.exports = mongoose.model('Movie', movieSchema);