import React, { useState, useEffect } from 'react';

/**
 * DelayedFallback Component
 * Supplementary Problem 2: Adds a minimum-delay fallback (300ms)
 * to avoid flickering loading states on fast network connections.
 */
function DelayedFallback({ delay = 300, message = 'Loading component chunk...' }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) {
    return null;
  }

  return (
    <div className="spinner delayed-fallback" role="status" aria-live="polite" style={{ margin: '3rem auto', maxWidth: '450px' }}>
      <div className="spinner-ring" />
      <p style={{ fontWeight: 500, color: 'var(--text-secondary, #666)' }}>{message}</p>
    </div>
  );
}

export default DelayedFallback;
