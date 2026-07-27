import React from 'react';

function RepoList({ repos }) {
  return (
    <div className="project-list">
      {repos.map((repo) => (
        <article key={repo.id} className="project-card repo-card">
          <h3>
            <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-link">
              {repo.name}
            </a>
          </h3>
          <p>{repo.description || 'No description provided for this repository.'}</p>

          <div className="repo-meta">
            <div className="repo-left">
              <span className="repo-stars">{repo.stargazers_count} stars</span>
              {repo.language && <span className="repo-language">{repo.language}</span>}
            </div>

            <div className="repo-right">
              {repo.topics && repo.topics.length > 0 && (
                <div className="repo-topics">
                  {repo.topics.slice(0, 5).map((t) => (
                    <span key={t} className="topic-badge">{t}</span>
                  ))}
                </div>
              )}

              <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-url">
                View repository
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default RepoList;