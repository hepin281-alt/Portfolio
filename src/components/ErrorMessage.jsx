import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <h3>Could not load repositories</h3>
      <p>{message}</p>
      <button type="button" className="theme-toggle" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;