// Variable para la conexión con el servidor Socket.io
let socket;

// Variables de la máquina de estados
let estadoActual = 'fase1';
let cancion;
let analizer; // Para analizar el sonido

// Variables para los parámetros de los clientes M1 y M2
let parametroM1 = 0.5;
let parametroM2 = 0.5;
let palabrasRecibidas = [];

// Nuevas variables para la interacción del público en D1
let colorVotado = 'morado'; // Color por defecto
let pulsosRecibidos = 0; // Contador de pulsos
let ultimoPulso = 0; // Para calcular el ritmo
let ritmoPromedio = 0;

let pulsanteM1 = false;
let direccionM1 = false;
let gravedadM1 = false;

let formaM2 = false;
let estroboscopicoM2 = false;
let agruparM2 = false;

let parametros = { m1: 0.5, m2: 0.5 };

function preload() {
  // Carga la canción
  // IMPORTANTE: Debes colocar el archivo 'Afrodita.mp3' dentro de la carpeta 'clientevisuales'
  cancion = loadSound('./Afrodita.mp3'); 
}

function setup() {
  // Crea el canvas en el tamaño de la ventana
  createCanvas(windowWidth, windowHeight);
  
  // Inicializa la conexión con el servidor
  socket = io();

  // El cliente visuales se une a su "habitación"
  socket.emit('join_room', 'visuales');

  // -------------------- Manejo de eventos del servidor --------------------

  // Recibe la señal para cambiar de estado
  socket.on('estado_actualizado', (nuevoEstado) => {
    console.log(`Cambiando a la fase: ${nuevoEstado}`);
    estadoActual = nuevoEstado;
  });

  // Recibe los parámetros de los clientes M1 y M2
  socket.on('parametro_m1_actualizado', (data) => {
    parametros.m1 = data;
  });

  socket.on('parametro_m2_actualizado', (data) => {
    parametros.m2 = data;
  });

  // Recibe las palabras del cliente D1 (público)
  socket.on('palabra_recibida', (palabra) => {
    palabrasRecibidas.push(palabra);
    // Limita el número de palabras en el array para no sobrecargarlo
    if (palabrasRecibidas.length > 10) {
      palabrasRecibidas.shift(); // Elimina la palabra más antigua
    }
  });

  // Nuevos oyentes para los controles de M1
  socket.on('m1_pulsante_actualizado', (data) => {
    pulsanteM1 = data;
  });

  socket.on('m1_cambio_direccion_actualizado', (data) => {
    direccionM1 = data;
  });
  
  socket.on('m1_gravedad_actualizado', (data) => {
    gravedadM1 = data;
  });

  // Nuevos oyentes para los controles de M2
  socket.on('m2_forma_actualizado', (data) => {
    formaM2 = data;
  });

  socket.on('m2_estroboscopico_actualizado', (data) => {
    estroboscopicoM2 = data;
  });
  
  socket.on('m2_agrupar_actualizado', (data) => {
    agruparM2 = data;
  });

  // Recibe la señal de pausa/reproducir
  socket.on('control_musica_desde_servidor', (accion) => {
    if (accion === 'play' && !cancion.isPlaying()) {
      cancion.play();
    } else if (accion === 'pause' && cancion.isPlaying()) {
      cancion.pause();
    }
  });

  // Nuevo oyente para el voto de color
  socket.on('voto_color_audiencia', (color) => {
    colorVotado = color;
  });

  // Nuevo oyente para el pulso de ritmo
  socket.on('pulso_ritmo_audiencia', () => {
    let tiempoActual = millis();
    if (ultimoPulso !== 0) {
      let intervalo = tiempoActual - ultimoPulso;
      // Promedio del ritmo para suavizar
      ritmoPromedio = (ritmoPromedio * 0.9 + (1000 / intervalo) * 0.1);
    }
    ultimoPulso = tiempoActual;
    pulsosRecibidos++;
  });

  // Configura el analizador de sonido
  analizer = new p5.Amplitude();
  analizer.setInput(cancion);
}

function draw() {
  // La máquina de estados: llama a la función de dibujo correspondiente
  switch (estadoActual) {
    case 'fase1':
      dibujarFase1();
      break;
    case 'fase2':
      dibujarFase2();
      break;
    case 'fase3':
      dibujarFase3();
      break;
    default:
      // En caso de que el estado no coincida, pinta un fondo de seguridad.
      background(0);
      break;
  }
}

// -------------------- Funciones de cada fase (Mejoradas) --------------------

// -------------------- Funciones de cada fase (Versión Final) --------------------

function dibujarFase1() {
  // Ahora el color morado puede ser alterado por el voto del público.
  let colorFondo;
  switch(colorVotado) {
    case 'morado':
      colorFondo = color(10, 0, 20);
      break;
    case 'azul':
      colorFondo = color(0, 10, 20);
      break;
    case 'ambar':
      colorFondo = color(20, 10, 0);
      break;
    default:
      colorFondo = color(10, 0, 20);
  }
  background(colorFondo);

  let nivelAmplitud = analizer.getLevel();

  // AHORA USAMOS `parametros.m1` y `parametros.m2`
  let numCirculos = map(parametros.m1, 0, 1, 10, 100);
  let sizeBase = map(parametros.m2, 0, 1, 30, 150);
  
  for (let i = 0; i < numCirculos; i++) {
    let x = map(noise(frameCount * 0.005 + i), 0, 1, 0, width);
    let y = map(noise(frameCount * 0.007 + i), 0, 1, 0, height);

    let r = map(sin(frameCount * 0.01 + i), -1, 1, 100, 200);
    let g = 0;
    let b = map(cos(frameCount * 0.02 + i), -1, 1, 150, 255);
    let alpha = map(nivelAmplitud, 0, 0.5, 50, 150);
    fill(r, g, b, alpha);
    
    let size = sizeBase + nivelAmplitud * 300;
    noStroke();
    if (formaM2) {
      rect(x, y, size, size);
    } else {
      ellipse(x, y, size, size);
    }
  }

  // Lógica para el modo pulsante
  if (pulsanteM1) {
    let pulsacion = sin(frameCount * 0.1) * 20;
    size = sizeBase + nivelAmplitud * 300 + pulsacion;
  }
  
}

function dibujarFase2() {
  // La amplitud de la onda se ve afectada por la velocidad de los pulsos del público.
  background(10, 10, 50);

  let x_offset = 0;
  let nivelAmplitud = analizer.getLevel();
  let amp = map(nivelAmplitud, 0, 1, 50, 500);

  // AHORA USAMOS `parametros.m2` y `parametros.m1`
  let ritmoVisual = map(ritmoPromedio, 0, 2, 0.05, 0.2);
  let ondaAmplitud = map(parametros.m2, 0, 1, 100, 800) + amp + ritmoVisual * 500;
  
  let ondaFrecuencia = map(parametros.m1, 0, 1, 0.01, 0.05);

  let colorOnda = color(
    map(sin(frameCount * 0.01), -1, 1, 100, 255),
    map(cos(frameCount * 0.01), -1, 1, 100, 255),
    map(sin(frameCount * 0.02), -1, 1, 200, 255)
  );

  if (direccionM1) {
    x_offset = width;
  }

  noFill();
  strokeWeight(5);
  if (estroboscopicoM2 && frameCount % 5 === 0) { // Destello cada 5 fotogramas
    stroke(255, 255, 255, 200);
  } else if (!estroboscopicoM2) {
    // Restablece el color normal si el modo estroboscópico no está activo
    stroke(colorOnda, 150);
  }

  beginShape();
  for (let x = x_offset; x <= x_offset + width; x += 10) {
    let y = height / 2 + sin(x * ondaFrecuencia + frameCount * 0.05) * (ondaAmplitud);
    vertex(x, y);
  }
  endShape();
}

let palabrasConVida = []; // Para gestionar las palabras que caen

function dibujarFase3() {
  // Rendición y Ruptura
  // Fragmentos de palabras y partículas que caen y se disuelven.
  background(5, 0, 5); // Fondo casi negro

  // Agregar nuevas palabras a la lista
  if (palabrasRecibidas.length > 0) {
    let nuevaPalabra = palabrasRecibidas.pop(); // Saca la última palabra
    palabrasConVida.push({
      texto: nuevaPalabra,
      x: random(width),
      y: -50, // Empieza fuera de la pantalla
      alpha: 255
    });
  }

  // Dibujar y actualizar las palabras en movimiento
  for (let i = palabrasConVida.length - 1; i >= 0; i--) {
    let p = palabrasConVida[i];
    
    // Velocidad de caída controlada por M1
    let velocidad = map(parametros.m1, 0, 1, 1, 5);
    // Lógica para la gravedad
    if (gravedadM1) {
      velocidad += 5; // Aumenta la velocidad de caída
    }

    if (agruparM2) {
      let centroX = width / 2;
      let centroY = height / 2;
      let dirX = centroX - p.x;
      let dirY = centroY - p.y;
      let distancia = dist(p.x, p.y, centroX, centroY);
      p.x += dirX * 0.05; // Ajusta la velocidad de movimiento
      p.y += dirY * 0.05;
    } else {
      p.y += velocidad;
    }
    
    // Opacidad controlada por M2 (velocidad de desvanecimiento)
    let desvanecimiento = map(parametroM2, 0, 1, 0.5, 5);
    p.alpha -= desvanecimiento;

    // Dibujar la palabra
    fill(255, p.alpha);
    textSize(32);
    textAlign(CENTER);
    text(p.texto, p.x, p.y);

    // Si la palabra es invisible o sale de la pantalla, la eliminamos
    if (p.alpha <= 0 || p.y > height + 50) {
      palabrasConVida.splice(i, 1);
    }
  }
}

// Función para el control de la música
function mousePressed() {
  // Esta función es necesaria para que la música se reproduzca en el navegador
  // El navegador requiere una interacción del usuario para iniciar el audio
  // En un concierto, el operador del cliente 'remoto' será el que inicie la canción.
  // Pero aquí, para pruebas, puedes hacer clic para iniciarla.
  if (!cancion.isPlaying()) {
    cancion.play();
  }
}

// Ajusta el tamaño del canvas si se redimensiona la ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}