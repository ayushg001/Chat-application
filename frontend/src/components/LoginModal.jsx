/**
 * Login Modal Component
 * Allows user to choose a username and avatar emoji.
 */

import React, { useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { getAvatarColor } from '../utils/helpers';

const AVATAR_OPTIONS = ['👨‍💻', '👩‍💻', '🚀', '🌟', '🦊', '⚡', '☕', '🎨'];

export default function LoginModal({ onLogin }) {
  const [username, setUsername] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(AVATAR_OPTIONS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username cannot exceed 20 characters');
      return;
    }

    onLogin({
      username: trimmed,
      avatar: selectedEmoji,
      color: getAvatarColor(trimmed)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-icon">
          <MessageSquare size={28} />
        </div>
        <h1>Welcome to Vedaz Chat</h1>
        <p>Real-time messaging powered by React, Node.js & Socket.io</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="usernameInput">Choose your username</label>
            <input
              id="usernameInput"
              type="text"
              className="form-input"
              placeholder="e.g. Alex, Maya, DevSam"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              maxLength={20}
            />
            {error && <span style={{ color: 'var(--danger-red)', fontSize: '0.78rem', marginTop: '0.3rem', display: 'block' }}>{error}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Pick your avatar emoji</label>
            <div className="avatar-selector">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`avatar-choice ${selectedEmoji === emoji ? 'selected' : ''}`}
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{ background: 'var(--bg-card)' }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={!username.trim()}>
            <span>Join Chat Room</span>
            <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '6px' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
