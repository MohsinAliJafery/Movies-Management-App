import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetails = ({ movies }) => {
  const { movieId } = useParams(); // Get movieId from URL
  const movie = movies.find((movie) => movie.movieId === parseInt(movieId));

  // If movie is not found, return a message
  if (!movie) {
    return <p className="text-white text-center text-2xl">Movie Not Found</p>;
  }

  // State for expanding the description
  const [expandedDescription, setExpandedDescription] = useState(false);

  const handleToggleDescription = () => {
    setExpandedDescription(!expandedDescription);
  };

  return (
    <div className="p-6 bg-gray-900 w-full">
      {/* Movie Title at the Top */}
      <h1 className="text-4xl font-bold text-center text-[#E50914] mb-8">
        {movie.title}
      </h1>

      <div className="max-w-full mx-auto bg-black border-gray-700 border-2 p-6 rounded-lg shadow-lg">
        {/* Video Player */}
        <div className="mb-8">
          {movie.videoUrl && (
            <video
              width="100%"
              controls
              className="rounded-lg"
              poster={movie.image}
            >
              <source src={movie.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Movie Poster and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="col-span-1">
            <img
              src={movie.image}
              alt={movie.title}
              className="object-cover w-full rounded-lg shadow-lg h-auto"
            />
          </div>

          {/* Movie Information */}
          <div className="col-span-2 text-white">
            {/* Description Section */}
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-lg">
              {expandedDescription
                ? movie.longDescription
                : `${movie.longDescription.substring(0, 200)}...`}
            </p>
            <button
              onClick={handleToggleDescription}
              className="text-[#E50914] font-medium mt-2"
            >
              {expandedDescription ? 'Show Less' : 'Read More'}
            </button>

            {/* Additional Info */}
            <div className="mt-6">
              <p className="mb-2">
                <span className="font-medium text-gray-400">Genre:</span>{' '}
                {movie.genre}
              </p>
              <p className="mb-2">
                <span className="font-medium text-gray-400">Release Date:</span>{' '}
                {new Date(movie.releaseDate).toLocaleDateString() || 'N/A'}
              </p>
              <p className="mb-2">
                <span className="font-medium text-gray-400">Price:</span> $
                {movie.price ? movie.price.toFixed(2) : 'N/A'}
              </p>
              <p className="mb-2">
                <span className="font-medium text-gray-400">Director:</span>{' '}
                {movie.director || 'Not Available'}
              </p>
              <p>
                <span className="font-medium text-gray-400">Cast:</span>{' '}
                {movie.cast || 'Not Available'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetails;
