/**
 * Message Item Component
 * Renders individual message bubble with sender info, timestamp, and status ticks.
 */

import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatTime, getAvatarColor } from '../utils/helpers';

export default function MessageItem({ message, isMine }) {
  const { sender, text, timestamp, status } = message;

  // Render status icon for current user's sent messages
  const renderStatus = () => {
    if (!isMine) return null;

    if (status === 'read') {
      return (
        <span className="status-icon read" title="Read">
          <CheckCheck size={14} color="#60a5fa" />
        </span>
      );
    } else if (status === 'delivered') {
      return (
        <span className="status-icon delivered" title="Delivered">
          <CheckCheck size={14} color="rgba(255,255,255,0.7)" />
        </span>
      );
    } else {
      return (
        <span className="status-icon sent" title="Sent">
          <Check size={14} color="rgba(255,255,255,0.7)" />
        </span>
      );
    }
  };

  return (
    <div className={`message-row ${isMine ? 'mine' : 'other'}`}>
      {/* Show avatar only for other people's messages */}
      {!isMine && (
        <div 
          className="avatar"
          style={{ 
            background: getAvatarColor(sender),
            width: '32px',
            height: '32px',
            fontSize: '0.8rem',
            alignSelf: 'flex-end',
            marginBottom: '4px'
          }}
          title={sender}
        >
          {sender.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="message-bubble">
        {!isMine && <div className="message-sender">{sender}</div>}
        <div className="message-text">{text}</div>
        <div className="message-meta">
          <span>{formatTime(timestamp)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
