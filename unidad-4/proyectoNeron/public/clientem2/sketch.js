// Variable para la conexión con el servidor Socket.io
let socket;

function setup() {
  socket = io();
  socket.emit('join_room', 'm2');

  const fase1Container = document.getElementById('control-fase-1');
  const fase2Container = document.getElementById('control-fase-2');
  const fase3Container = document.getElementById('control-fase-3');
  const estadoDisplay = document.getElementById('estado-display');
  
  // -------------------- Manejo de clics y sliders por fase --------------------
  
  // FASE 1
  const slider1 = document.getElementById('parametroSlider1');
  const valorDisplay1 = document.getElementById('parametroValor1');
  slider1.addEventListener('input', () => {
    const valor = parseFloat(slider1.value);
    valorDisplay1.textContent = valor.toFixed(2);
    socket.emit('actualizar_parametro_m2', valor);
  });
  
  const formaBtn = document.getElementById('formaBtn');
  formaBtn.addEventListener('click', () => {
    const estado = formaBtn.getAttribute('data-active') === 'true' ? false : true;
    formaBtn.setAttribute('data-active', estado);
    formaBtn.style.backgroundColor = estado ? '#0d6a8a' : '#6a0dad';
    socket.emit('m2_forma', estado);
  });

  // FASE 2
  const slider2 = document.getElementById('parametroSlider2');
  const valorDisplay2 = document.getElementById('parametroValor2');
  slider2.addEventListener('input', () => {
    const valor = parseFloat(slider2.value);
    valorDisplay2.textContent = valor.toFixed(2);
    socket.emit('actualizar_parametro_m2', valor);
  });

  const estroboscopicoBtn = document.getElementById('estroboscopicoBtn');
  estroboscopicoBtn.addEventListener('click', () => {
    const estado = estroboscopicoBtn.getAttribute('data-active') === 'true' ? false : true;
    estroboscopicoBtn.setAttribute('data-active', estado);
    estroboscopicoBtn.style.backgroundColor = estado ? '#0d6a8a' : '#6a0dad';
    socket.emit('m2_estroboscopico', estado);
  });

  // FASE 3
  const slider3 = document.getElementById('parametroSlider3');
  const valorDisplay3 = document.getElementById('parametroValor3');
  slider3.addEventListener('input', () => {
    const valor = parseFloat(slider3.value);
    valorDisplay3.textContent = valor.toFixed(2);
    socket.emit('actualizar_parametro_m2', valor);
  });

  const agruparBtn = document.getElementById('agruparBtn');
  agruparBtn.addEventListener('click', () => {
    const estado = agruparBtn.getAttribute('data-active') === 'true' ? false : true;
    agruparBtn.setAttribute('data-active', estado);
    agruparBtn.style.backgroundColor = estado ? '#0d6a8a' : '#6a0dad';
    socket.emit('m2_agrupar', estado);
  });

  // -------------------- Manejo de cambio de estado desde el servidor --------------------
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
}