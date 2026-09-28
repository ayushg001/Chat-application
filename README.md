# Real-Time Chat Application

A real-time chat application built with **React**, **Node.js**, **Express**, **Socket.io**, and **MongoDB Atlas**.

---

## Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, Lucide React
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB Atlas (via Mongoose)

---

## Features

- **Real-Time Messaging**: Instant bi-directional messaging with Socket.io (no page refresh required).
- **Persistent Chat History**: Messages are stored in MongoDB Atlas and fetched via REST API on page load.
- **Message Timestamps**: Displays formatted timestamps for each message.
- **Typing Indicators**: Real-time indication when another user is typing.
- **Online/Offline User Status**: Live counter and active user presence tracking.
- **Message Search**: Filter conversation history by sender or message content.
- **Dummy Authentication**: Username-based login with avatar emoji selection.

---

## Project Structure

```text
vedaz/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   └── messageController.js # REST API controllers
│   ├── models/
│   │   └── Message.js       # Mongoose Schema
│   ├── routes/
│   │   └── messageRoutes.js # Express routes
│   ├── socket/
│   │   └── chatSocket.js    # Socket.io handlers
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (ChatHeader, MessageList, etc.)
│   │   ├── services/        # api.js and socket.js
│   │   ├── utils/           # Time and avatar helpers
│   │   ├── App.jsx          # Main chat state
│   │   ├── index.css        # Stylesheet
│   │   └── main.jsx         # React root
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## Environment Variables

Create a `backend/.env` file with the following variables:

```ini
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://ayushguptanonmedical_db_user:NwDunZ9sfnwLh9lS@cluster0.locfwnc.mongodb.net/chat_app?appName=Cluster0
NODE_ENV=development
```

---

## REST APIs

### 1. Get Chat History
- **Method**: `GET`
- **Endpoint**: `/api/messages`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "6aba633fe1c27c6ff886704d",
      "sender": "Ayush",
      "text": "Hello!",
      "timestamp": "2026-09-28T12:53:19.589Z"
    }
  ]
}
```

### 2. Send Message
- **Method**: `POST`
- **Endpoint**: `/api/messages`
- **Body**:
```json
{
  "sender": "Ayush",
  "text": "Hello everyone!"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "_id": "6aba633fe1c27c6ff886704d",
    "sender": "Ayush",
    "text": "Hello everyone!",
    "timestamp": "2026-09-28T12:53:19.589Z"
  }
}
```

---

## Socket.io Events

| Event | Direction | Description |
| :--- | :--- | :--- |
| `user:join` | Client ➡️ Server | Join the chat room with username |
| `users:online` | Server ➡️ Client | Updated list of connected users |
| `message:send` | Client ➡️ Server | Send a new message |
| `message:receive` | Server ➡️ Client | Broadcast new message to all clients |
| `typing:start` | Client ➡️ Server | User started typing |
| `typing:stop` | Client ➡️ Server | User stopped typing |
| `typing:status` | Server ➡️ Client | Broadcast typing indicator state |

---

## Design Decisions & Assumptions

1. **Database**: Used MongoDB Atlas with Mongoose for cloud data persistence.
2. **Real-Time + REST**: Socket.io provides instantaneous bi-directional communication, while REST APIs handle initial chat history loading and standard API endpoints.
3. **Authentication**: Implemented a lightweight username session stored in `localStorage` so users can quickly test multi-user conversations across tabs without complex authentication barriers.
