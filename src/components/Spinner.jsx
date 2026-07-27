import React from 'react';

function Spinner() {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <div className="spinner-ring" />
      <p>Loading repositories...</p>
    </div>
  );
}

export default Spinner;