import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext'; 
import { useNavigate } from 'react-router-dom';

const Navbar = ({ authToken, setAuthToken }) => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext); // Use context for theme

  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({ name: '', avatar: '', userId: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('https://movie-backend-qcl3.onrender.com/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setAuthToken(data.token);
          setUser({
            name: data.userName || 'User',
            avatar: data.userAvatar || '/default-avatar.png',
            userId: data.userId || '',
          });
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    const storedUserName = localStorage.getItem('userName');
    const storedUserAvatar = localStorage.getItem('userAvatar');
    const storedUserId = localStorage.getItem('userId');

    if (storedUserName && storedUserAvatar && storedUserId) {
      setIsLoggedIn(true);
      setUser({
        name: storedUserName,
        avatar: storedUserAvatar,
        userId: storedUserId,
      });
      setIsLoading(false);
    } else if (!authToken) {
      checkSession();
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, [authToken, setAuthToken]);

  const handleLogout = async () => {
    try {
      await fetch('https://movie-backend-qcl3.onrender.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      localStorage.removeItem('userName');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('userId');
      setAuthToken(null);
      setUser({ name: '', avatar: '', userId: '' });
      setIsLoggedIn(false);
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => setShowMenu((prev) => !prev);

  if (isLoading) {
    return (
      <nav className={`p-6 ${isDarkMode ? 'bg-white text-black' : 'bg-[#E50914] text-white'}`}>
        <div className="flex justify-between items-center container mx-auto">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-3xl font-semibold">
              <img src="/video-icon.png" alt="Logo" className="w-8 h-8 mr-2" />
              Movies App
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`p-6 ${isDarkMode ? 'bg-white text-black' : 'bg-[#E50914] text-white'}`}>
      <div className="flex justify-between items-center container mx-auto">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center text-3xl font-semibold">
            <img src="/video-icon.png" alt="Logo" className="w-10 h-10 mr-2" />
            MovaFlix
          </Link>
          {isLoggedIn && (
            <Link to="/favorites" className="text-xl font-medium hover:text-gray-200">
              <FaHeart className="mr-2 inline-block text-2xl" />
              Favorites
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="text-xl p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-all duration-300"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-white border-2 text-[#E50914] rounded-full hover:bg-[#E50914] hover:text-white transition-all duration-300"
              >
                <FaSignInAlt className="inline-block mr-2" /> Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-white border-2 text-[#E50914] rounded-full hover:bg-[#E50914] hover:text-white transition-all duration-300"
              >
                <FaUserPlus className="inline-block mr-2" /> Register
              </button>
            </>
          ) : (
            <div className="relative menu-container">
              <img
                src={user.avatar}
                className="w-12 h-12 rounded-full cursor-pointer border-2 border-white"
                onClick={toggleMenu}
                alt="User Avatar"
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-700">
                      Welcome, {user.name}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 transition-all duration-300"
                  >
                    <FaSignOutAlt className="inline-block mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
