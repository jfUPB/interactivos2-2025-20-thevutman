// Variable para la conexión con el servidor Socket.io
let socket;

function setup() {
  // Inicializa la conexión con el servidor
  socket = io();

  // El cliente m1 se une a su "habitación"
  socket.emit('join_room', 'm1');
  
  // -------------------- Manejo del slider --------------------

  const slider = document.getElementById('parametroSlider');
  const valorDisplay = document.getElementById('parametroValor');

  // Escucha el evento 'input' para capturar cambios en tiempo real
  slider.addEventListener('input', () => {
    const valor = parseFloat(slider.value);
    valorDisplay.textContent = valor.toFixed(2); // Muestra el valor con dos decimales
    
    // Envía el valor del slider al servidor
    console.log(`Enviando parámetro M1: ${valor}`);
    socket.emit('actualizar_parametro_m1', valor);
  });
}