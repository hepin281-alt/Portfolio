import React, { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('About');

  const mySkills = ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Node.js', 'Vite'];

  return (
    <div className="app-container">
      <NavBar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Header 
        name="Hepinn Bhuva" 
        title="Frontend Developer & UI/UX Enthusiast" 
        themeColor="linear-gradient(135deg, #4A90E2, #8E44AD)" 
      />
      
      <main className="main-content">
        {activeSection === 'About' && <About />}
        {activeSection === 'Skills' && <Skills skillList={mySkills} />}
        {activeSection === 'Projects' && <Projects />}
      </main>
      
      <Footer contactInfo="Get in touch: 24aiml004@charusat.edu.in" />
    </div>
  );
}

export default App;
