document.addEventListener('DOMContentLoaded', function() {
    // Make connection
    var socket = io.connect('http://95.82.250.107:5000');

    // Buttons and inputs
    var message = document.getElementById('message');
    var username = document.getElementById('username');
    var send_message = document.getElementById('send_message');
    var send_username = document.getElementById('send_username');
    var chatroom = document.getElementById('chatroom');
    var feedback = document.getElementById('feedback');

    // Emit message
    send_message.addEventListener('click', function() {
        socket.emit('new_message', { message: message.value });
        location.reload(); // Обновление страницы после отправки сообщения
        message.value = '';
    });

    // Listen on new_message
    socket.on("new_message", function(data) {
        feedback.innerHTML = '';
        message.value = '';
        chatroom.innerHTML += "<p class='message'>" + data.username + ": " + data.message + "</p>";
    });

    // Emit a username
    send_username.addEventListener('click', function() {
        socket.emit('change_username', { username: username.value });
        username.value = '';
    });

    // Emit typing
    message.addEventListener('keypress', function() {
        socket.emit('typing', { username: username.value });
    });

    // Listen on typing
    socket.on('typing', function(data) {
        feedback.innerHTML = "<p><i>" + data.username + " is typing a message..." + "</i></p>";
    });

    // Listen for chat history
    socket.on('chat_history', function(data) {
        data.history.forEach(function(chat) {
            if (chat.length > 0)
                chatroom.innerHTML += "<p class='message'>" + chat.substr(0, 100) + "</p>";
        });
    });
});

