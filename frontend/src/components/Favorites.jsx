import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get userId from localStorage
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      // Redirect to login page or handle unauthenticated users
      console.log("User not logged in.");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/favorites', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) throw new Error('Failed to fetch favorites');
        
        const data = await response.json();

        // Ensure unique movieId by filtering out duplicates
        const uniqueFavorites = Array.from(new Set(data.map((movie) => movie.movieId)))
          .map((movieId) => data.find((movie) => movie.movieId === movieId));

        setFavorites(uniqueFavorites);  // Set the unique favorites
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);  // Stop the loading spinner
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-white text-3xl font-bold mb-6">Your Favorites</h1>
      {isLoading ? (
        <div className="text-white text-center">Loading...</div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((movie) => (
            <div key={movie.movieId} className="bg-black border-gray-700 border-2 p-4 rounded-lg shadow-lg">
              <Link to={`/movie/${movie.movieId}`} className="flex flex-col">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="rounded-lg w-full h-64 object-cover mb-4"
                />
                <h2 className="text-[#E50914] text-lg font-semibold mb-2">{movie.title}</h2>
                <p className="text-white text-sm">{movie.description}</p>
                <p className="text-white mt-2">
                  <span className="font-medium">Genre:</span> {movie.genre}
                </p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-center">No favorite movies added yet.</div>
      )}
    </div>
  );
};

export default Favorites;
