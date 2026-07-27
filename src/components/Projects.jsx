import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import RepoList from './RepoList';

const GITHUB_REPOS_URL = 'https://api.github.com/users/hepin281-alt/repos?per_page=12&sort=updated';

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retryIndex, setRetryIndex] = useState(0);

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

          {/* AI/ML-only toggle removed per request */}
        </div>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={() => setRetryIndex((current) => current + 1)} />}
      {!loading && !error && <RepoList repos={filteredRepos} />}
      {!loading && !error && filteredRepos.length === 0 && <p className="empty-state">No repositories match your search.</p>}
    </section>
  );
}

export default Projects;
