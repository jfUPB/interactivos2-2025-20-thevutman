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

  // Oyentes para las nuevas interacciones de M1
  socket.on('m1_pulsante', (data) => {
    console.log(`M1: Modo pulsante activado: ${data}`);
    io.to('visuales').emit('m1_pulsante_actualizado', data);
  });

  socket.on('m1_cambio_direccion', (data) => {
    console.log(`M1: Cambio de dirección de ondas: ${data}`);
    io.to('visuales').emit('m1_cambio_direccion_actualizado', data);
  });

  socket.on('m1_gravedad', (data) => {
    console.log(`M1: Gravedad activada: ${data}`);
    io.to('visuales').emit('m1_gravedad_actualizado', data);
  });

  // Oyentes para las nuevas interacciones de M2
  socket.on('m2_forma', (data) => {
    console.log(`M2: Cambio de forma activado: ${data}`);
    io.to('visuales').emit('m2_forma_actualizado', data);
  });

  socket.on('m2_estroboscopico', (data) => {
    console.log(`M2: Modo estroboscópico activado: ${data}`);
    io.to('visuales').emit('m2_estroboscopico_actualizado', data);
  });

  socket.on('m2_agrupar', (data) => {
    console.log(`M2: Agrupar partículas activado: ${data}`);
    io.to('visuales').emit('m2_agrupar_actualizado', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});