import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import DelayedFallback from './components/DelayedFallback';
import './App.css';

// ─── Route-Based Lazy Loading (Code Splitting) ─────────────────────
// Chunks are loaded on-demand only when the respective route is visited
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const TaskManager = lazy(() => import('./components/TaskManager'));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    return () => {
      document.documentElement.classList.remove('dark-mode');
    };
  }, [isDarkMode]);

  // Memoized callback to prevent unnecessary NavBar re-renders
  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode((current) => !current);
  }, []);

  return (
    <div className="app-container">
      <NavBar isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />
      <main className="main-content">
        {/* Suspense boundary wrapped strictly around route block with minimum delay fallback */}
        <Suspense fallback={<DelayedFallback delay={300} message="Loading route component..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/task-manager" element={<TaskManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer contactInfo="Get in touch: 24aiml004@charusat.edu.in" />
    </div>
  );
}

export default App;
