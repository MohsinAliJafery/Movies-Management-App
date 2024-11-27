import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { ThemeProvider } from './context/ThemeContext';
import Favorites from './components/Favorites';
import axios from 'axios';
import './index.css'; // Optional for styles
import MovieDetails from './components/MovieDetails';
import Footer from './components/Footer';

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch movies
    axios
      .get('https://movie-backend-qcl3.onrender.com/api/movies')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => console.error(error));
  }, [authToken]);

  const toggleFavorite = (movieId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => String(fav.movieId) === String(movieId));
      if (isFavorite) {
        return prevFavorites.filter((fav) => String(fav.movieId) !== String(movieId));
      } else {
        const movieToAdd = movies.find((movie) => String(movie.movieId) === String(movieId));
        return [...prevFavorites, movieToAdd];
      }
    });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      console.log("User not logged in.");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('https://movie-backend-qcl3.onrender.com/api/favorites', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch favorites');
        
        const data = await response.json();
        setFavorites(data); // Set the favorite movies in the state
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <ThemeProvider>
    <Router>
      <div className="bg-black min-h-screen">
        <Navbar authToken={authToken} setAuthToken={setAuthToken} />
        <div className=" mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  authToken={authToken}
                  movies={movies}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/favorites"
              element={<Favorites favorites={favorites} />}
            />
            <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
            <Route path="/movie/:movieId" element={<MovieDetails movies={movies} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
