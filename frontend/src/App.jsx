/**
 * Main Application Component
 * Coordinates state for messages, online presence, typing status,
 * and Socket.io / REST communication.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import LoginModal from './components/LoginModal';
import { fetchMessages, sendMessageApi } from './services/api';
import { 
  initSocket, 
  sendSocketMessage, 
  sendMessageRead, 
  disconnectSocket 
} from './services/socket';

const STORAGE_KEY = 'vedaz_chat_user';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);

  // 1. Fetch message history via REST API on mount
  const loadMessageHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const history = await fetchMessages(100);
      setMessages(history);
    } catch (err) {
      console.error('Failed to load message history from REST API:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadMessageHistory();
  }, [loadMessageHistory]);

  // 2. Setup Socket.io real-time connection
  useEffect(() => {
    if (!currentUser?.username) return;

    const socket = initSocket(currentUser.username);

    function onConnect() {
      setIsConnected(true);
      socket.emit('user:join', { username: currentUser.username });
      sendMessageRead(currentUser.username);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onReceiveMessage(newMessage) {
      setMessages((prev) => {
        const newId = newMessage._id || newMessage.id;
        if (newId && prev.some((m) => (m._id || m.id) === newId)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      if (newMessage.sender !== currentUser.username) {
        sendMessageRead(currentUser.username);
      }
    }

    function onOnlineUsers(users) {
      setOnlineUsers(users || []);
    }

    function onUserJoined(data) {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}-${Math.random()}`,
          isSystem: true,
          text: `${data.username} joined the chat room`,
          timestamp: data.timestamp
        }
      ]);
    }

    function onUserLeft(data) {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}-${Math.random()}`,
          isSystem: true,
          text: `${data.username} left the chat room`,
          timestamp: data.timestamp
        }
      ]);
    }

    function onTypingStatus({ username, isTyping }) {
      if (username === currentUser.username) return;
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter((name) => name !== username);
        }
      });
    }

    function onReadReceipt({ reader }) {
      if (reader === currentUser.username) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === currentUser.username && msg.status !== 'read'
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:receive', onReceiveMessage);
    socket.on('users:online', onOnlineUsers);
    socket.on('user:joined', onUserJoined);
    socket.on('user:left', onUserLeft);
    socket.on('typing:status', onTypingStatus);
    socket.on('message:read_receipt', onReadReceipt);

    if (socket.connected) {
      setIsConnected(true);
      socket.emit('user:join', { username: currentUser.username });
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:receive', onReceiveMessage);
      socket.off('users:online', onOnlineUsers);
      socket.off('user:joined', onUserJoined);
      socket.off('user:left', onUserLeft);
      socket.off('typing:status', onTypingStatus);
      socket.off('message:read_receipt', onReadReceipt);
    };
  }, [currentUser]);

  const handleLogin = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    disconnectSocket();
    setCurrentUser(null);
    setIsConnected(false);
  };

  const handleSendMessage = async (text) => {
    if (!currentUser?.username || !text.trim()) return;

    try {
      if (isConnected) {
        await sendSocketMessage(currentUser.username, text);
      } else {
        const saved = await sendMessageApi({
          sender: currentUser.username,
          text
        });
        setMessages((prev) => [...prev, saved]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(
      (m) =>
        m.text?.toLowerCase().includes(q) ||
        m.sender?.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  return (
    <div className="app-layout">
      {/* Sidebar with Users and Brand */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Chat Area */}
      <main className="chat-container">
        <ChatHeader
          onlineCount={onlineUsers.length}
          isConnected={isConnected}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <MessageList
          messages={filteredMessages}
          currentUser={currentUser}
          typingUsers={typingUsers}
          loading={loadingHistory}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          currentUser={currentUser}
          disabled={!currentUser}
        />
      </main>

      {/* Username Login Modal */}
      {!currentUser && <LoginModal onLogin={handleLogin} />}
    </div>
  );
}
