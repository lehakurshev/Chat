const express = require('express');
const app = express();
const path = require('path');

// Установка пути к статическим файлам (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера на порту 5000
app.listen(5000, '192.168.0.115', () => {
    console.log('Сервер запущен по адресу http://192.168.0.115:5000');
});