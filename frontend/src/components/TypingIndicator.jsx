/**
 * Typing Indicator Component
 * Displays animated dots and username of who is typing.
 */

import React from 'react';

export default function TypingIndicator({ typingUsers = [] }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const names = typingUsers.slice(0, 2).join(', ');
  const extraCount = typingUsers.length - 2;
  const label = extraCount > 0 
    ? `${names} and ${extraCount} other${extraCount > 1 ? 's' : ''} are typing`
    : `${names} ${typingUsers.length === 1 ? 'is' : 'are'} typing`;

  return (
    <div className="typing-bar">
      <div className="typing-dots">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span>{label}...</span>
    </div>
  );
}
