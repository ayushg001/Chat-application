/**
 * Message Input Component
 * Handles text typing, Enter key submission, emoji quick-reactions, and debounced typing events.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { sendTypingStart, sendTypingStop } from '../services/socket';

const QUICK_EMOJIS = ['👋', '👍', '🔥', '🚀', '❤️', '🎉'];

export default function MessageInput({ onSendMessage, currentUser, disabled }) {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (currentUser?.username) {
      sendTypingStart(currentUser.username);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStop(currentUser.username);
      }, 1500);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (currentUser?.username) {
      sendTypingStop(currentUser.username);
    }

    onSendMessage(trimmed);
    setText('');

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const appendEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="chat-input-area">
      {/* Quick emoji reaction pills */}
      <div className="quick-emojis">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="emoji-pill"
            onClick={() => appendEmoji(emoji)}
            title={`Insert ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="input-form">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          type="button"
          className="send-btn"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
