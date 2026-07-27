import React, { useState } from 'react';

function Contact() {
    const [message, setMessage] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    return (
        <section className="contact-page">
            <h2>Contact Me</h2>
            <p>Type a short message and watch the preview update in real time.</p>

            <label className="contact-label" htmlFor="message">
                Your message
            </label>
            <input
                id="message"
                className="contact-input"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write something here..."
            />

            <div className="contact-meta">
                <p>Live preview: {message || 'Start typing to see your text here.'}</p>
                <p>{message.length} characters</p>
            </div>

            <button type="button" className="help-toggle" onClick={() => setShowHelp((current) => !current)}>
                {showHelp ? 'Hide help' : 'Show help'}
            </button>

            {showHelp && (
                <div className="help-tooltip">
                    Use the input above to update the preview and character count instantly.
                </div>
            )}
        </section>
    );
}

export default Contact;