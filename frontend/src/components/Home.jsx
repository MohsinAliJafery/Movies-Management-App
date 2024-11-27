import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaThLarge, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles for Toastify

const Home = ({ movies, favorites, toggleFavorite }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const moviesPerPage = 10;

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const handleSort = (criteria) => setSortCriteria(criteria);

  const handleFilterGenre = (genre) => setFilterGenre(genre);

  const filteredMovies = movies
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchQuery) &&
        (filterGenre ? movie.genre === filterGenre : true)
    )
    .sort((a, b) => {
      if (sortCriteria === 'price') return a.trackPrice - b.trackPrice;
      if (sortCriteria === 'releaseDate') return new Date(a.releaseDate) - new Date(b.releaseDate);
      return 0;
    });

  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + moviesPerPage);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getUserId = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://movie-backend-qcl3.onrender.com/api/auth/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('User not logged in');
      const data = await response.json();
      
      if (data.userId) {
        return data.userId;
      } else {
        throw new Error('No user ID returned');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (movieId) => {
    const userId = await getUserId();
    if (!userId) {
      toast.error('Please log in to add favorites!', {
        icon: <span style={{ color: "#ff6347" }}></span>, // Set your icon color
      });
      return;
    }
  
    const isFavorite = favorites.some(fav => String(fav.movieId) === String(movieId));
    const url = `https://movie-backend-qcl3.onrender.com/api/favorites${isFavorite ? '/remove' : '/add'}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId, userId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toggleFavorite(movieId); // Toggle favorite locally

        toast.success(
          isFavorite ? 'Removed from favorites' : 'Added to favorites', {
            icon: <span style={{ color: "#ff6347" }}>🔥</span>, // Set your icon color
          }
        );
      } else {
        toast.error(data.error || 'Error toggling favorite');
      }

    } catch (error) {
      toast.error('Error toggling favorite');
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <ToastContainer />
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full lg:w-[calc(100%-120px)] p-10 bg-black text-white text-3xl placeholder-gray-500 rounded-lg font-medium text-lg"
        />
        <div className="flex space-x-4">
          <button
            className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-[#E50914] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setViewMode('grid')}
          >
            <FaThLarge />
          </button>
          <button
            className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-[#E50914] text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setViewMode('list')}
          >
            <FaBars />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4 bg-black p-6 rounded-lg shadow-lg">
          <h2 className="text-white text-2xl font-bold mb-4">Filters</h2>
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Sort By</label>
            <select
              value={sortCriteria}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
            >
              <option value="">None</option>
              <option value="price">Price</option>
              <option value="releaseDate">Release Date</option>
            </select>
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Genre</label>
            <select
              value={filterGenre}
              onChange={(e) => handleFilterGenre(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
            >
              <option value="">All</option>
              {Array.from(new Set(movies.map((movie) => movie.genre))).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Movies List */}
        <div className="flex-1">
          <h1 className="text-white text-3xl font-bold mb-6">Movies</h1>
          {isLoading ? (
            <div className="text-white text-center">Loading...</div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-6'}>
              {currentMovies.map((movie) => {
                const longDescription = movie.longDescription || 'No Description Available';
                const shortDescription = longDescription.length > 100 ? longDescription.substring(0, 100) + '...' : longDescription;

                return (
                  <div
                    key={movie.movieId}
                    className={`bg-black border-gray-700 border-2 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out ${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}
                  >
                    <Link to={`/movie/${movie.movieId}`} className="flex flex-col">
                      {/* Movie Poster */}
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className={`rounded-lg ${viewMode === 'grid' ? 'w-full h-64 object-cover mb-4' : 'w-32 h-32 object-cover'}`}
                      />
                      <h2 className="text-[#E50914] text-lg font-semibold mb-2">{movie.title}</h2>
                      {/* Movie Description */}
                      <p className="text-white mb-2">{viewMode === 'list' ? longDescription : shortDescription}</p>
                      <p className="text-white text-sm">{movie.genre}</p>
                      {/* Price Display */}
                      <p className="text-white text-lg font-semibold mt-2">${movie.price}</p>
                    </Link>

                    {/* Favorite Icon */}
                    <div className="mt-2">
                      {favorites.some(fav => String(fav.movieId) === String(movie.movieId)) ? (
                        <FaHeart
                          className="text-[#E50914] cursor-pointer"
                          onClick={() => addFavorite(movie.movieId)}
                        />
                      ) : (
                        <FaRegHeart
                          className="text-white cursor-pointer"
                          onClick={() => addFavorite(movie.movieId)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center space-x-2">
            <button
              className="bg-[#E50914] text-white px-4 py-2 rounded-lg"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-white">{currentPage} / {totalPages}</span>
            <button
              className="bg-[#E50914] text-white px-4 py-2 rounded-lg"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
