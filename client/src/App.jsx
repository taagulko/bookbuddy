import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/globals.css';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import Library from './pages/Library';
import BookDetails from './pages/BookDetails';
import QuotesBoard from './pages/QuotesBoard'; 
function App() {
  return (
    <Router>
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
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