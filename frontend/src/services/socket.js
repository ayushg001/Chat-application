/**
 * Socket.io Client Service
 * Manages WebSocket connection, events, and message transmissions.
 */

import { io } from 'socket.io-client';

let socket = null;

export function initSocket(username) {
  if (socket) {
    if (socket.connected) {
      socket.emit('user:join', { username });
      return socket;
    }
    socket.connect();
    return socket;
  }

  // Connect through Vite proxy to http://localhost:5000
  socket = io(window.location.origin, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('[Socket.io] Connected, id:', socket.id);
    if (username) {
      socket.emit('user:join', { username });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.io] Disconnected:', reason);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function sendSocketMessage(sender, text) {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      return reject(new Error('Socket is not connected'));
    }

    socket.emit('message:send', { sender, text }, (res) => {
      if (res && res.success) {
        resolve(res.data);
      } else {
        reject(new Error(res?.error || 'Failed to send message via socket'));
      }
    });
  });
}

export function sendTypingStart(username) {
  if (socket && socket.connected) {
    socket.emit('typing:start', { username });
  }
}

export function sendTypingStop(username) {
  if (socket && socket.connected) {
    socket.emit('typing:stop', { username });
  }
}

export function sendMessageRead(reader) {
  if (socket && socket.connected) {
    socket.emit('message:read', { reader });
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
