const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// -------------------- Lógica del Servidor con Socket.io --------------------
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Unir a los clientes a "habitaciones" específicas según su propósito
  // Esto es para que los mensajes no se reenvíen a todos los clientes innecesariamente.
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Cliente ${socket.id} se unió a la habitación: ${room}`);
  });

  // Reenvía mensajes del cliente 'remoto' a la habitación 'visuales'
  socket.on('cambiar_estado', (estado) => {
    console.log(`Estado cambiado a: ${estado}`);
    io.emit('estado_actualizado', estado);
  });

  // Reenvía datos de los clientes de parámetros ('m1', 'm2') a la habitación 'visuales'
  socket.on('actualizar_parametro_m1', (data) => {
    console.log(`Parámetro M1 actualizado:`, data);
    io.to('visuales').emit('parametro_m1_actualizado', data);
  });

  socket.on('actualizar_parametro_m2', (data) => {
    console.log(`Parámetro M2 actualizado:`, data);
    io.to('visuales').emit('parametro_m2_actualizado', data);
  });

  // Reenvía palabras del cliente 'd1' (público) a la habitación 'visuales'
  socket.on('enviar_palabra', (palabra) => {
    console.log(`Palabra del público recibida: ${palabra}`);
    io.to('visuales').emit('palabra_recibida', palabra);
  });

  // Manejo del control de la música
  socket.on('control_musica', (accion) => {
    console.log(`Acción de música: ${accion}`);
    io.to('visuales').emit('control_musica_desde_servidor', accion);
  });

  // Añadir nuevos oyentes para los inputs del público
  socket.on('voto_color', (colorVotado) => {
    console.log(`Voto de color recibido: ${colorVotado}`);
    io.to('visuales').emit('voto_color_audiencia', colorVotado);
  });

  socket.on('pulso_ritmo', (pulso) => {
    console.log(`Pulso de ritmo recibido: ${pulso}`);
    io.to('visuales').emit('pulso_ritmo_audiencia', pulso);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});