const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); 
const io = socketIO(server); 
const port = 3000;
let counter = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');
    console.log(counter++);

    // El cliente debe enviar su rol al conectarse
    socket.on('join', (role) => {
        socket.join(role);
        console.log(`Client joined room: ${role}`);
    });

    // Solo el controlador puede cambiar el estado
    socket.on('changeState', (message) => {
        // Envía a visuals, desktop2 y mobile2
        io.to('visuals').emit('message', message);
        io.to('desktop2').emit('message', message);
        io.to('mobile2').emit('message', message);
        console.log(`Controller sent state change: ${message}`);
    });

    // Recibe posición touch de mobile2 y la reenvía a visuals
    socket.on('touchPosition', (message) => {
        io.to('visuals').emit('touchPosition', message);
        console.log(`Touch position sent to visuals: ${message}`);
    });

    socket.on('cursorPosition', (message) => {
        io.to('visuals').emit('cursorPosition', message);
        console.log(`Cursor position sent to visuals: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});