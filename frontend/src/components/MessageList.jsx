/**
 * Message List Component
 * Renders scrollable history, groups messages by date, and manages scroll position.
 */

import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { formatDate } from '../utils/helpers';
import { MessageSquareDashed } from 'lucide-react';

export default function MessageList({ messages = [], currentUser, typingUsers = [] }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  let lastDateStr = null;

  return (
    <div className="messages-container" ref={scrollRef}>
      {messages.length === 0 ? (
        <div className="empty-chat">
          <MessageSquareDashed size={48} />
          <h3>No messages yet</h3>
          <p>Say hello and start the conversation in real-time!</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id || index} className="system-message">
                {msg.text}
              </div>
            );
          }

          const currentDateStr = formatDate(msg.timestamp);
          const showDateDivider = currentDateStr !== lastDateStr;
          if (showDateDivider) {
            lastDateStr = currentDateStr;
          }

          const isMine = msg.sender === currentUser?.username;

          return (
            <React.Fragment key={msg._id || msg.id || index}>
              {showDateDivider && (
                <div className="date-separator">
                  <span>{currentDateStr}</span>
                </div>
              )}
              <MessageItem message={msg} isMine={isMine} />
            </React.Fragment>
          );
        })
      )}

      {/* Typing Indicator */}
      <TypingIndicator typingUsers={typingUsers} />
    </div>
  );
}
