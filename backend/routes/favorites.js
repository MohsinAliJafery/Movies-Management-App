const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Movie = require('../Models/Movie');

const router = require('express').Router();

// Middleware to verify session
const verifySession = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).send('Not authenticated');
    }
    next();
};

// Get user favorites with populated movie details
router.get('/favorites', async (req, res) => {
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).send('Not authenticated');
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find movies by their movieIds (stored in the favorites array)
    const movies = await Movie.find({ movieId: { $in: user.favorites } });

    // Send the found movies as the response
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorites' });
  }
});


// Add a movie to favorites
router.post('/favorites/add', verifySession, async (req, res) => {
    const { movieId } = req.body;
    const userId = req.session.userId; // Correctly using session data
  
    try {
      const user = await User.findById(userId);
      console.log(movieId)
      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        await user.save();
      }
      res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
    } catch (error) {
      res.status(500).json({ error: 'Error adding to favorites' });
    }
});

// Remove a movie from favorites
router.post('/favorites/remove', verifySession, async (req, res) => {
  const { movieId, userId } = req.body;
  // const userId = req.session.userId; // Use session userId if applicable
  
  try {
    // Log types and values for debugging
    console.log("UserID:", userId, "Type:", typeof userId);
    console.log("MovieID:", movieId, "Type:", typeof movieId);
  
    // Find the user by ID
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    // Convert IDs to strings before comparison
    const movieIdStr = String(movieId);
    user.favorites = user.favorites.filter((id) => String(id) !== movieIdStr);
  
    // Log updated favorites
    console.log("Updated Favorites:", user.favorites);
  
    // Save the updated user document
    await user.save();
  
    // Respond with success
    res.status(200).json({ message: 'Favorite removed successfully', favorites: user.favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Error removing favorite' });
  }
});

// Get user favorites
router.get('/favorites/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorites' });
  }
});

// Protected route example to check if the user is logged in
router.get('/profile', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).send('Not authenticated');
    }
  
    // Send user info if logged in
    res.status(200).send({
      name: req.session.name,
      email: req.session.email
    });
});

module.exports = router;
