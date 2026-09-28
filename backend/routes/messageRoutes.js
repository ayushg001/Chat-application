/**
 * Message Routes
 * Express router mapping REST endpoints to controller methods.
 */

const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');

// GET /api/messages - Fetch previous messages
router.get('/', getMessages);

// POST /api/messages - Send a message
router.post('/', sendMessage);

module.exports = router;
