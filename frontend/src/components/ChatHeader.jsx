/**
 * Chat Header Component
 * Displays channel title, member count, connection status pill, and mobile toggle.
 */

import React from 'react';
import { Menu, Users } from 'lucide-react';

export default function ChatHeader({ 
  onlineCount = 0, 
  isConnected = false, 
  onToggleSidebar 
}) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <button 
          className="mobile-toggle" 
          onClick={onToggleSidebar}
          aria-label="Toggle user list"
        >
          <Menu size={22} />
        </button>

        <div className="channel-info">
          <h2>
            <span># general-lounge</span>
          </h2>
          <p>Real-time community conversation</p>
        </div>
      </div>

      <div className="header-badges">
        {/* Connection status pill */}
        <div className={`connection-pill ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="pulse-dot" />
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>

        {/* Member count */}
        <div className="connection-pill" style={{ color: 'var(--text-dim)' }}>
          <Users size={14} />
          <span>{onlineCount} Online</span>
        </div>
      </div>
    </header>
  );
}
