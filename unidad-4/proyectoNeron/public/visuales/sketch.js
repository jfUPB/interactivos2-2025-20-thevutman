// --- ESQUELETO BASE PARA VISUALES ---

let socket;
let currentState = "STATE_A";
let stateParams = {}; // Parámetros recibidos del remoto
let clientInputs = []; // Inputs de móviles/escritorio

// Fragmentos clave de la letra (puedes ajustar o rotar según el estado)
const lyricFragments = [
  "Hoy busco dónde estás en esta inmensidad,",
  "Eres mi regalo y castigo.",
  "Eres las olas del mar, la luz en la oscuridad.",
  "Ese dolor que se convierte en mi amigo.",
  "Te siento levantarme si me derribo.",
  "Quiero poder caminar contigo.",
  "Aunque posiblemente me destruyas.",
  "Para el dolor te convertiste en una cura.",
  "Sin siquiera estar a tu lado, ya generas placer.",
  "A tus labios soy adicto.",
  "Vivo en la locura de no ser quien significo.",
  "Las heridas del papel en el que escribo."
];

let lyricIndex = 0;
let lyricTimer = 0;

let keyBursts = [];

let song;
let isPlaying = false;

function preload() {
  soundFormats('mp3', 'ogg');
  song = loadSound('afrodita.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Conexión a Socket.IO
  socket = io();

  // Registrar rol
  socket.emit("registerRole", { role: "visuals" });

  // Escuchar cambios de estado
  socket.on("visuals:state", ({ state }) => {
    currentState = state;
    // Aquí puedes iniciar transición suave si lo deseas
  });

  // Escuchar parámetros del remoto
  socket.on("visuals:params", (params) => {
    stateParams = params;
    // Puedes interpolar/transicionar parámetros aquí
  });

  socket.on("visuals:ingest", (payload) => {
    // payload: { sourceId, type, data }
    if (payload.type === "key" && payload.sourceId === "cliented1") {
      triggerKeyEffect(payload.data.key);
    } else {
      clientInputs.push({ ...payload, t: millis() });
    }
  });

  socket.on("visuals:word", (payload) => {
    if (!window.fallingWords) window.fallingWords = [];
    window.fallingWords.push({
      word: payload.word,
      x: random(width * 0.2, width * 0.8),
      y: -20,
      alpha: 1,
      speed: random(1, 2.5)
    });
  });

  socket.on("audio:command", handleAudioCommand);
}

function handleAudioCommand(cmd) {
  if (cmd.type === "play") song.play();
  if (cmd.type === "pause") song.pause();
  if (cmd.type === "volume") song.setVolume(cmd.value);
  if (cmd.type === "jump") song.jump(cmd.value); // value: segundos
}

function draw() {
  background(0, 0, 0, 0.15); // Ligeramente transparente para estelas

  // Limpiar inputs viejos (ejemplo: solo últimos 2 segundos)
  let now = millis();
  clientInputs = clientInputs.filter(inp => now - inp.t < 2000);

  // Máquina de estados
  if (currentState === "STATE_A") {
    drawStateA();
  } else if (currentState === "STATE_B") {
    drawStateB();
  } else if (currentState === "STATE_C") {
    drawStateC();
  }

  // HUD mínimo (estado actual)
  drawHUD();

  // Dibuja los keyBursts
  for (let i = keyBursts.length - 1; i >= 0; i--) {
    let b = keyBursts[i];
    fill(b.hue, 80, 100, b.alpha);
    ellipse(b.x, b.y, b.r, b.r);
    b.r += 6;
    b.alpha *= 0.93;
    if (b.alpha < 0.05) keyBursts.splice(i, 1);
  }

  // Mostrar fragmentos de la letra en momentos clave (ejemplo: cada 12s)
  if (millis() - lyricTimer > 12000) {
    lyricIndex = (lyricIndex + 1) % lyricFragments.length;
    showLyric(lyricFragments[lyricIndex]);
    lyricTimer = millis();
  }
}

function showLyric(text) {
  const overlay = document.getElementById("lyric-overlay");
  overlay.textContent = text;
  overlay.style.opacity = 0.85;
  setTimeout(() => { overlay.style.opacity = 0; }, 10000);
}

// --- Algoritmo visual detallado para STATE_A ---

let halos = [];

function drawStateA() {
  // Decaimiento visual (estela)
  fill(0, 0, 0, 0.15);
  rect(0, 0, width, height);

  // Agregar nuevos halos desde los inputs recientes
  for (let inp of clientInputs) {
    let { data, sourceId } = inp;
    let x = data.x * width;
    let y = data.y * height;

    // Parámetros desde remoto o valores por defecto
    let radius = stateParams.radius || 60;
    let hue = stateParams.hue || 270;
    let decay = stateParams.decay || 0.85;
    let alpha = 0.3;

    // Color por sourceId para agencia visual
    let sourceHue = {
      clientem1: 280,
      clientem2: 260,
      cliented1: 295
    }[sourceId] || hue;

    halos.push({
      x, y,
      r: radius,
      hue: sourceHue,
      alpha,
      decay,
      born: millis()
    });
  }

  // Dibujar y actualizar halos
  for (let i = halos.length - 1; i >= 0; i--) {
    let h = halos[i];
    fill(h.hue, 60, 80, h.alpha);
    ellipse(h.x, h.y, h.r, h.r);

    // Expansión y desvanecimiento
    h.r *= 1.01;
    h.alpha *= h.decay;

    // Eliminar si es muy transparente o grande
    if (h.alpha < 0.01 || h.r > width * 1.2) {
      halos.splice(i, 1);
    }
  }
}

function drawStateB() {
  // Parámetros desde remoto o valores por defecto
  let speed = stateParams.speed || 2;
  let noiseAmp = stateParams.noise || 0.2;
  let thickness = stateParams.thickness || 4;

  // Guardar ondas activas
  if (!window.waves) window.waves = [];

  // Generar nuevas ondas a partir de inputs recientes
  for (let inp of clientInputs) {
    let { data, sourceId } = inp;
    let x = data.x * width;
    let y = data.y * height;

    // Solo crear onda si es un burst (puedes mejorar el trigger)
    if (random() < 0.05) {
      window.waves.push({
        x, y,
        r: 10,
        t0: millis(),
        hue: sourceId === "clientem1" ? 210 : sourceId === "clientem2" ? 40 : 200,
        alpha: 0.7
      });
    }
  }

  // Dibujar y actualizar ondas
  for (let i = window.waves.length - 1; i >= 0; i--) {
    let w = window.waves[i];
    let t = (millis() - w.t0) / 1000;
    let r = w.r + t * speed * 80;
    let a = w.alpha * map(r, 10, width * 0.7, 1, 0);

    strokeWeight(thickness);
    noFill();
    stroke(w.hue, 80, 100, a);

    // Dibuja la onda con turbulencia (ruido)
    beginShape();
    for (let ang = 0; ang < TWO_PI; ang += 0.05) {
      let nr = r + noise(w.x + cos(ang) * 10, w.y + sin(ang) * 10, t) * noiseAmp * 80;
      let px = w.x + cos(ang) * nr;
      let py = w.y + sin(ang) * nr;
      vertex(px, py);
    }
    endShape(CLOSE);

    // Eliminar si es muy grande o transparente
    if (r > width * 0.7 || a < 0.01) {
      window.waves.splice(i, 1);
    }
  }
  noStroke();
}

function drawStateC() {
  // Parámetros desde remoto o valores por defecto
  let tempo = stateParams.tempo || 120;
  let contrast = stateParams.contrast || 0.5;
  let density = stateParams.density || 16;

  // --- GRID DE PARTÍCULAS ---
  let cols = floor(constrain(density, 6, 40));
  let rows = floor(cols * (height / width));
  let cellW = width / cols;
  let cellH = height / rows;

  // Oscilación global por tempo
  let osc = sin(millis() * 0.002 * (tempo / 60));

  // Inputs activos para "anclar" partículas
  let anchors = clientInputs.map(inp => ({
    x: inp.data.x * width,
    y: inp.data.y * height
  }));

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cx = i * cellW + cellW / 2;
      let cy = j * cellH + cellH / 2;

      // Calcular distancia a los anchors
      let minDist = anchors.length > 0 ? min(anchors.map(a => dist(cx, cy, a.x, a.y))) : 9999;
      let fallDelay = map(minDist, 0, 120, 1.5, 0.2, true);

      // Caída modulada por tiempo y delay
      let fall = (millis() * 0.04 * fallDelay + i * 10) % height;
      let bright = map(osc, -1, 1, 60 - 40 * contrast, 100);

      fill(210, 10, bright, 0.8);
      ellipse(cx, (cy + fall) % height, cellW * 0.5, cellH * 0.5);
    }
  }

  // --- PALABRAS QUE CAEN ---
  if (!window.fallingWords) window.fallingWords = [];
  let wordList = ["ausencia", "deseo", "ruptura", "eco", "placer", "dolor", "vacío", "memoria", "silencio"];
  
  // Probabilidad de spawn según inputs
  if (random() < 0.01 * clientInputs.length) {
    let w = random(wordList);
    let x = random(width * 0.2, width * 0.8);
    window.fallingWords.push({
      word: w,
      x,
      y: -20,
      alpha: 1,
      speed: random(1, 2.5)
    });
  }

  // Dibujar y actualizar palabras
  textAlign(CENTER, CENTER);
  textSize(cellH * 0.8);
  for (let i = window.fallingWords.length - 1; i >= 0; i--) {
    let fw = window.fallingWords[i];
    fill(210, 0, 100, fw.alpha * 0.8);
    text(fw.word, fw.x, fw.y);

    fw.y += fw.speed;
    fw.alpha *= 0.992;

    if (fw.y > height + 30 || fw.alpha < 0.05) {
      window.fallingWords.splice(i, 1);
    }
  }
}

function triggerKeyEffect(key) {
  // Puedes mapear diferentes teclas a diferentes colores/efectos
  let hue = 270; // Default morado
  if ("aeiou".includes(key.toLowerCase())) hue = 45; // Vocales = ámbar
  if (" ".includes(key)) hue = 200; // Espacio = azul
  if ("1234567890".includes(key)) hue = 120; // Números = verde

  keyBursts.push({
    x: random(width * 0.2, width * 0.8),
    y: random(height * 0.2, height * 0.8),
    r: 40,
    hue,
    alpha: 1
  });
}

function drawHUD() {
  push();
  fill(0, 0, 100, 0.7);
  rect(10, 10, 180, 40, 8);
  fill(0, 0, 0);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Estado: ${currentState}`, 20, 20);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}