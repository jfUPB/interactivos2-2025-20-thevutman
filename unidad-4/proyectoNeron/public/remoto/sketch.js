// Variable para la conexión con el servidor Socket.io
let socket;

function setup() {
  // Inicializa la conexión con el servidor
  // En este caso, no necesitamos canvas, así que no se usa createCanvas()
  socket = io();

  // El cliente remoto se une a su "habitación"
  socket.emit('join_room', 'remoto');

  // -------------------- Manejo de clics en los botones --------------------

  // Botón para cambiar a la Fase 1
  const fase1Btn = document.getElementById('fase1Btn');
  fase1Btn.addEventListener('click', () => {
    console.log("Enviando comando: cambiar a Fase 1");
    socket.emit('cambiar_estado', 'fase1');
  });

  // Botón para cambiar a la Fase 2
  const fase2Btn = document.getElementById('fase2Btn');
  fase2Btn.addEventListener('click', () => {
    console.log("Enviando comando: cambiar a Fase 2");
    socket.emit('cambiar_estado', 'fase2');
  });

  // Botón para cambiar a la Fase 3
  const fase3Btn = document.getElementById('fase3Btn');
  fase3Btn.addEventListener('click', () => {
    console.log("Enviando comando: cambiar a Fase 3");
    socket.emit('cambiar_estado', 'fase3');
  });

  // Botón para reproducir la música
  const playBtn = document.getElementById('playBtn');
  playBtn.addEventListener('click', () => {
    console.log("Enviando comando: Reproducir");
    socket.emit('control_musica', 'play');
  });

  // Botón para pausar la música
  const pauseBtn = document.getElementById('pauseBtn');
  pauseBtn.addEventListener('click', () => {
    console.log("Enviando comando: Pausar");
    socket.emit('control_musica', 'pause');
  });
}