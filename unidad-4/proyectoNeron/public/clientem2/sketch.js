// Variable para la conexión con el servidor Socket.io
let socket;

function setup() {
  // Inicializa la conexión con el servidor
  socket = io();

  // El cliente m2 se une a su "habitación"
  socket.emit('join_room', 'm2');
  

  // -------------------- Manejo del slider --------------------

  const slider = document.getElementById('parametroSliderM2');
  const valorDisplay = document.getElementById('parametroValorM2');

  // Escucha el evento 'input' para capturar cambios en tiempo real
  slider.addEventListener('input', () => {
    const valor = parseFloat(slider.value);
    valorDisplay.textContent = valor.toFixed(2); // Muestra el valor con dos decimales
    
    // Envía el valor del slider al servidor
    console.log(`Enviando parámetro M2: ${valor}`);
    socket.emit('actualizar_parametro_m2', valor);
  });
}