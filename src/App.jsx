import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Projects from './components/Projects';
import Home from './components/Home';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import TaskManager from './components/TaskManager';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    return () => {
      document.documentElement.classList.remove('dark-mode');
    };
  }, [isDarkMode]);

  return (
    <div className="app-container">
      <NavBar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode((current) => !current)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer contactInfo="Get in touch: 24aiml004@charusat.edu.in" />
    </div>
  );
}

export default App;
