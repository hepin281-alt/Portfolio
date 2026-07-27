import React from 'react';
import Header from './Header';
import About from './About';
import Skills from './Skills';

function Home() {
    const mySkills = ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NumPy', 'Pandas', 'scikit-learn'];

    return (
        <>
            <Header
                name="Hepin Bhuva"
                title="AI / ML Engineer & Data Scientist"
                themeColor="linear-gradient(135deg, #4A90E2, #8E44AD)"
            />
            <About />
            <Skills skillList={mySkills} />
        </>
    );
}

export default Home;