const Message = require('../models/Message');

// Track online users: socketId -> username
const onlineUsers = new Map();

function initSocket(io) {
  io.on('connection', (socket) => {
    // Helper to get array of unique active users
    const getActiveUsers = () => {
      const uniqueNames = Array.from(new Set(onlineUsers.values()));
      return uniqueNames.map((name) => ({ username: name }));
    };

    // When a user logs in / joins the chat
    socket.on('user:join', (data) => {
      const username = typeof data === 'string' ? data : data?.username;
      if (!username || !username.trim()) return;

      const cleanName = username.trim();
      onlineUsers.set(socket.id, cleanName);

      // Notify all clients of updated online members
      io.emit('users:online', getActiveUsers());

      // Broadcast join notification to others
      socket.broadcast.emit('user:joined', {
        username: cleanName,
        timestamp: new Date().toISOString()
      });
    });

    // When a user sends a real-time message
    socket.on('message:send', async (data) => {
      try {
        const { sender, text } = data;
        if (!sender || !text || !text.trim()) return;

        // Save to MongoDB Atlas
        const newMessage = await Message.create({
          sender: sender.trim(),
          text: text.trim()
        });

        // Broadcast to everyone (including sender)
        io.emit('message:receive', newMessage);
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });

    // Typing indicators
    socket.on('typing:start', (data) => {
      socket.broadcast.emit('typing:status', {
        username: data?.username || onlineUsers.get(socket.id),
        isTyping: true
      });
    });

    socket.on('typing:stop', (data) => {
      socket.broadcast.emit('typing:status', {
        username: data?.username || onlineUsers.get(socket.id),
        isTyping: false
      });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      const username = onlineUsers.get(socket.id);
      if (username) {
        onlineUsers.delete(socket.id);
        io.emit('users:online', getActiveUsers());
        io.emit('user:left', {
          username,
          timestamp: new Date().toISOString()
        });
      }
    });
  });
}

module.exports = { initSocket };
