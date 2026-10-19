import React, { useState } from 'react';

/**
 * ProjectAnalytics Component
 * Supplementary Problem 1: Heavy visualization & analytics component
 * loaded on-demand only when requested by the user.
 */
function ProjectAnalytics() {
  const [metricTab, setMetricTab] = useState('summary');

  const stats = [
    { label: 'Total Repositories', value: '14', change: '+3 this month' },
    { label: 'Total Commits (2025-2026)', value: '348', change: 'Consistent activity' },
    { label: 'Primary Language', value: 'JavaScript / React', change: '82% of codebase' },
    { label: 'Bundle Efficiency', value: '78.4% reduction', change: 'Post-code splitting' },
  ];

  const technologies = [
    { name: 'React 19 & React Router 6', percentage: 88, color: '#61dafb' },
    { name: 'Express.js & Node.js', percentage: 76, color: '#68a063' },
    { name: 'MongoDB & Mongoose', percentage: 70, color: '#47a248' },
    { name: 'JWT & Security Middleware', percentage: 85, color: '#e67e22' },
    { name: 'Vite Code Splitting & Suspense', percentage: 95, color: '#9b59b6' },
  ];

  return (
    <div className="analytics-card" style={{
      background: 'var(--card-bg, #ffffff)',
      border: '1px solid var(--border-color, #e1e8ed)',
      borderRadius: '20px',
      padding: '2rem',
      marginTop: '2rem',
      boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary, #2c3e50)' }}>
            📊 Project Performance & Codebase Metrics
          </h3>
          <p style={{ margin: '0.4rem 0 0 0', color: 'var(--text-secondary, #7f8c8d)', fontSize: '0.95rem' }}>
            Lazily loaded on-demand via React.lazy & Suspense
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setMetricTab('summary')}
            className={`btn ${metricTab === 'summary' ? 'btn-primary' : 'btn-cancel'}`}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
          >
            Overview
          </button>
          <button
            onClick={() => setMetricTab('tech')}
            className={`btn ${metricTab === 'tech' ? 'btn-primary' : 'btn-cancel'}`}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
          >
            Tech Breakdown
          </button>
        </div>
      </div>

      {metricTab === 'summary' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {stats.map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(74, 144, 226, 0.05)',
              padding: '1.2rem',
              borderRadius: '12px',
              border: '1px solid rgba(74, 144, 226, 0.15)'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #7f8c8d)', marginBottom: '0.3rem' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--primary, #4a90e2)' }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#27ae60', marginTop: '0.3rem' }}>
                {item.change}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {technologies.map((t, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 500 }}>{t.name}</span>
                <span style={{ color: 'var(--text-secondary, #7f8c8d)' }}>{t.percentage}%</span>
              </div>
              <div style={{ height: '8px', background: '#ecf0f1', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${t.percentage}%`,
                  background: t.color,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectAnalytics;
