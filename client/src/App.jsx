import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Імпортуємо стилі
import './styles/globals.css';

// Імпортуємо компоненти
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Імпортуємо сторінки
import Home from './pages/Home';
import Library from './pages/Library';
import BookDetails from './pages/BookDetails';
import Forum from './pages/Forum';
import QASessions from './pages/QASessions';

function App() {
  return (
    <Router>
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/qa" element={<QASessions />} />
        </Routes>
      </main>
      
      <Footer />
    </Router>
  );
}

export default App;