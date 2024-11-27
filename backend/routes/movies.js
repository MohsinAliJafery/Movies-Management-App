const axios = require('axios');
const express = require('express');
const Movie = require('../Models/Movie')

const router = express.Router();

// Fetch movies from iTunes API
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://itunes.apple.com/search?term=star&country=au&media=movie&all');
    const movies = response.data.results.map((movie) => ({
      title: movie.trackName,
      movieId: movie.trackId, // Keep as movieId, not _id
      description: movie.shortDescription,
      longDescription: movie.longDescription,
      image: movie.artworkUrl100,
      videoUrl: movie.previewUrl,
      director: movie.artistName,
      cast: movie.longDescription, // Will extract cast from long description
      releaseDate: movie.releaseDate,
      genre: movie.primaryGenreName, // Add genre
      price: movie.trackPrice, // Add standard price
      hdPrice: movie.trackHdPrice, // Add HD price
    }));

    // Save movies to database if not already present
    for (const movieData of movies) {
      let movie = await Movie.findOne({ movieId: movieData.movieId }); // Query by movieId
      if (!movie) {
        movie = new Movie(movieData);
        await movie.save();
      }
    }

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching movies');
  }
});

module.exports = router;
