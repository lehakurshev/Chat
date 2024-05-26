const express = require('express');
const fs = require('fs');
const app = express();

// Set the template engine ejs
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));

// Routes for chat1
app.get('/chat1', (req, res) => {
  let chatHistory = fs.readFileSync('chatHistory1.txt', 'utf8');
  res.render('index', { chatHistory });
});

// Routes for chat2
app.get('/chat2', (req, res) => {
  let chatHistory = fs.readFileSync('chatHistory2.txt', 'utf8');
  res.render('index', { chatHistory });
});

// Routes for chat1
app.get('/chat3', (req, res) => {
  let chatHistory = fs.readFileSync('chatHistory3.txt', 'utf8');
  res.render('index', { chatHistory });
});

// Routes for chat2
app.get('/chat4', (req, res) => {
  let chatHistory = fs.readFileSync('chatHistory4.txt', 'utf8');
  res.render('index', { chatHistory });
});

// Listen on port 5000
const server = app.listen(5000);

// Socket.io instantiation
const io = require("socket.io")(server);

// Listen on every connection
io.on('connection', (socket) => {
  console.log('New user connected');

  // Default username
  socket.username = "Anonymous";

  // Define the chat history file based on the URL
  let chatHistoryFile = 'chatHistory1.txt';
  if (socket.handshake.headers.referer.includes('/chat2')) {
    chatHistoryFile = 'chatHistory2.txt';
  }
  else if (socket.handshake.headers.referer.includes('/chat3')) {
    chatHistoryFile = 'chatHistory3.txt';
  }
  else if (socket.handshake.headers.referer.includes('/chat4')) {
    chatHistoryFile = 'chatHistory4.txt';
  }

  // Listen on change_username
  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  socket.emit('chat_history', { history: fs.readFileSync(chatHistoryFile, 'utf8').split('\n') });

  // Listen on new_message
  socket.on('new_message', (data) => {
    // Broadcast the new message
    io.sockets.emit('new_message', { message: data.message, username: socket.username });

    // Save message to file
    fs.appendFileSync(chatHistoryFile, `${socket.username.substr(0, 20)}: ${data.message.substr(0, 50)}\n`);
  });

  // Listen on typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username });
  });
});







function clearChatHistory() {
  const fs = require('fs');
  const chatHistoryFiles = ['chatHistory1.txt', 'chatHistory2.txt', 'chatHistory3.txt'];

  // Get current time
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Check if it's 2:00
  if (minutes === 0) {
    // Clear each chat history file
    chatHistoryFiles.forEach((file) => {
      fs.writeFileSync(file, '', (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${file} has been cleared.`);
        }
      });
    });
  } else {
    console.log('00 yet');
  }
}

// Call the function every minute
setInterval(clearChatHistory, 60000); // 60000 milliseconds = 1 minute


