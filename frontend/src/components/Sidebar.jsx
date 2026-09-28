/**
 * Sidebar Component
 * Displays brand, search filter, live list of online users, and user profile with logout.
 */

import React from 'react';
import { MessageSquare, Search, LogOut, ShieldCheck } from 'lucide-react';
import { getAvatarColor } from '../utils/helpers';

export default function Sidebar({
  isOpen,
  onClose,
  onlineUsers = [],
  currentUser,
  onLogout,
  searchQuery,
  onSearchChange
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand header */}
        <div className="sidebar-header">
          <div className="brand-badge">
            <div className="brand-icon">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="brand-title">Vedaz Chat</div>
              <div className="brand-subtitle">Real-Time Messaging</div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="sidebar-search">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search in chat..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Online Users List */}
        <div className="users-section">
          <div className="users-section-title">
            <span>Online Members ({onlineUsers.length})</span>
          </div>

          {onlineUsers.length === 0 ? (
            <div style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              No other users online yet. Open in another tab to chat!
            </div>
          ) : (
            onlineUsers.map((user) => {
              const isMe = user.username === currentUser?.username;
              return (
                <div key={user.id || user.username} className="user-item">
                  <div className="avatar-wrapper">
                    <div
                      className="avatar"
                      style={{ background: getAvatarColor(user.username) }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="status-dot" />
                  </div>

                  <div className="user-name-info">
                    <div className="user-name-text">
                      {user.username}
                      {isMe && <span className="current-user-tag">You</span>}
                    </div>
                    <div className="user-status-text">Active now</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Current user profile card in footer */}
        {currentUser && (
          <div className="user-profile-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                className="avatar"
                style={{ 
                  background: currentUser.color || getAvatarColor(currentUser.username),
                  width: '38px',
                  height: '38px'
                }}
              >
                {currentUser.avatar || currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-name-info">
                <div className="user-name-text" style={{ fontWeight: 600 }}>
                  {currentUser.username}
                </div>
                <div className="user-status-text" style={{ color: 'var(--online-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} /> Connected
                </div>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={onLogout}
              title="Leave / Switch user"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
