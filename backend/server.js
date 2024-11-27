require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const favoriteRoutes = require('./routes/favorites');

const app = express();
const port = process.env.PORT || 5000;
// Configure CORS to allow requests from your front-end's domain
app.use(cors({
  origin: 'https://frontend-fs64.onrender.com', // Replace with your front-end URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

// Use express-session for session management
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 // 1 day session duration
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb://localhost:27017/movies-app

// Use the environment variable for the MongoDB URI
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api', favoriteRoutes);

app.listen(port, () => {
  console.log('Server running on port 5000');
});
