import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode state

  return (
    <footer className={`py-4 ${isDarkMode ? 'bg-white text-black' : 'bg-[#E50914] text-white'}`}>
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} MovaFlix. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
