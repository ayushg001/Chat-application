const Message = require('../models/Message');

// GET /api/messages - Fetch previous messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error fetching messages' });
  }
};

// POST /api/messages - Send a message via REST API
const sendMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;

    if (!sender || !text) {
      return res.status(400).json({ success: false, message: 'Sender and text are required' });
    }

    const newMessage = await Message.create({ sender, text });

    // Broadcast in real-time to connected socket clients
    const io = req.app.get('io');
    if (io) {
      io.emit('message:receive', newMessage);
    }

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

module.exports = {
  getMessages,
  sendMessage
};
