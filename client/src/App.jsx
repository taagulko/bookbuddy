import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/globals.css';
import './styles/theme.css'; // Переконайся, що імпортуєш тему!

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import Library from './pages/Library';
import BookDetails from './pages/BookDetails';
import QuotesBoard from './pages/QuotesBoard'; 

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
          <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/quotes" element={<QuotesBoard />} />
        </Routes>
      </main>
      
      <Footer />
    </Router>
  );
}

export default App;