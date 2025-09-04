// Variable para la conexión con el servidor Socket.io
let socket;

function setup() {
  socket = io();
  
  // El cliente D1 se une a su "habitación"
  socket.emit('join_room', 'publico');

  // Obtener referencias a los contenedores y elementos
  const fase1Container = document.getElementById('control-fase-1');
  const fase2Container = document.getElementById('control-fase-2');
  const fase3Container = document.getElementById('control-fase-3');
  const estadoDisplay = document.getElementById('estado-display');
  
  // -------------------- Manejo del cambio de estados --------------------
  socket.on('estado_actualizado', (nuevoEstado) => {
    fase1Container.classList.add('hidden');
    fase2Container.classList.add('hidden');
    fase3Container.classList.add('hidden');
    
    switch (nuevoEstado) {
      case 'fase1':
        fase1Container.classList.remove('hidden');
        estadoDisplay.textContent = 'Fase 1';
        break;
      case 'fase2':
        fase2Container.classList.remove('hidden');
        estadoDisplay.textContent = 'Fase 2';
        break;
      case 'fase3':
        fase3Container.classList.remove('hidden');
        estadoDisplay.textContent = 'Fase 3';
        break;
    }
  });

  // -------------------- Lógica de los botones de cada fase --------------------

  // Fase 1: Votación de Color
  const colorBtns = document.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      socket.emit('voto_color', color);
    });
  });

  // Fase 2: Pulso de Ritmo
  const pulsoBtn = document.getElementById('pulsoBtn');
  pulsoBtn.addEventListener('click', () => {
    socket.emit('pulso_ritmo', 'pulso');
  });

  // Fase 3: Envío de Palabras
  const form = document.getElementById('wordForm');
  const input = document.getElementById('wordInput');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const palabra = input.value.trim();
    if (palabra) {
      socket.emit('enviar_palabra', palabra);
      input.value = '';
      input.focus();
    }
  });
}