import React, { useEffect, useState, lazy, Suspense } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import RepoList from './RepoList';
import DelayedFallback from './DelayedFallback';

// Supplementary Problem 1: Lazy load heavy analytics component on demand
const ProjectAnalytics = lazy(() => import('./ProjectAnalytics'));

const GITHUB_REPOS_URL = 'https://api.github.com/users/hepin281-alt/repos?per_page=12&sort=updated';

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryIndex, setRetryIndex] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadRepositories() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(GITHUB_REPOS_URL);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response format');
        }

        if (isActive) {
          setRepos(data);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadRepositories();

    return () => {
      isActive = false;
    };
  }, [retryIndex]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || (repo.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="projects-page">
      <div className="projects-header">
        <div>
          <h2>My Projects</h2>
          <p>Live repositories fetched from the GitHub API.</p>
        </div>

        <div className="projects-toolbar">
          <input
            className="search-input"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search repositories by name"
            aria-label="Search repositories by name"
          />
        </div>
      </div>

      {/* Supplementary Problem 1: Lazy loaded heavy component toggle */}
      <div style={{ margin: '1.2rem 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn"
          onClick={() => setShowAnalytics((prev) => !prev)}
          style={{
            background: showAnalytics ? '#e1e8ed' : 'linear-gradient(135deg, #4a90e2, #357abd)',
            color: showAnalytics ? '#2c3e50' : '#ffffff',
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.2)'
          }}
        >
          {showAnalytics ? '✕ Hide Analytics' : '📊 View Analytics & Performance (Lazy Chunk)'}
        </button>
      </div>

      {showAnalytics && (
        <Suspense fallback={<DelayedFallback delay={100} message="Loading Analytics Module Chunk..." />}>
          <ProjectAnalytics />
        </Suspense>
      )}

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={() => setRetryIndex((current) => current + 1)} />}
      {!loading && !error && <RepoList repos={filteredRepos} />}
      {!loading && !error && filteredRepos.length === 0 && <p className="empty-state">No repositories match your search.</p>}
    </section>
  );
}

export default Projects;
