const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); 
const io = socketIO(server); 
const port = 3000;

// Archivos estáticos
app.use(express.static("public"));

// Rooms lógicos
const ROOM_VISUALS = "room:visuals";
const ROOM_REMOTE = "room:remote";
const ROOM_FEEDS = "room:feeds"; // cliented1, clientem1, clientem2

let currentState = "STATE_A"; // Estado inicial

io.on("connection", (socket) => {
  // --- Registro de roles ---
  socket.on("registerRole", ({ role, id }) => {
    socket.data.role = role;
    socket.data.clientId = id || socket.id;

    if (role === "visuals") socket.join(ROOM_VISUALS);
    else if (role === "remote") socket.join(ROOM_REMOTE);
    else socket.join(ROOM_FEEDS);

    console.log(`[REG] ${role} -> ${socket.data.clientId}`);
  });

  // --- Cambios de estado desde remoto ---
  socket.on("remote:changeState", ({ state }) => {
    currentState = state;
    io.to(ROOM_VISUALS).emit("visuals:state", { state, t: Date.now() });
    io.to(ROOM_REMOTE).emit("remote:state", { state }); // Feedback al remoto
    console.log(`[REMOTE] changeState -> ${state}`);
  });

  // --- Palabras clave desde remoto ---
  socket.on("remote:word", (payload) => {
    io.to(ROOM_VISUALS).emit("visuals:word", payload);
  });

  // --- Letra y parámetros creativos desde cliented1 ---
  socket.on("cliented1:lyric", (payload) => {
    io.to(ROOM_VISUALS).emit("visuals:lyric", payload);
  });
  socket.on("cliented1:params", (payload) => {
    io.to(ROOM_VISUALS).emit("visuals:lyricParams", payload);
  });

  // --- Comandos de audio desde clientem1 ---
  socket.on("clientem1:audio", (payload) => {
    io.to(ROOM_VISUALS).emit("visuals:audio", payload);
  });

  // --- Parámetros visuales y posiciones desde clientem2 ---
  socket.on("clientem2:params", (payload) => {
    io.to(ROOM_VISUALS).emit("visuals:params", payload);
  });
  socket.on("clientem2:touch", (payload) => {
    io.to(ROOM_VISUALS).emit("visuals:touch", payload);
  });

  // --- Inputs generales (demo, legacy, etc) ---
  socket.on("client:data", (payload) => {
    io.to(ROOM_VISUALS).emit("visuals:ingest", payload);
  });

  // --- MODO DEMO/AUTO ---
  let lastInputTime = Date.now();
  let demoInterval = null;
  function startDemoMode() {
    if (demoInterval) return;
    demoInterval = setInterval(() => {
      if (Date.now() - lastInputTime > 10000) {
        const demoSources = ["clientem1", "clientem2", "cliented1"];
        const payload = {
          sourceId: demoSources[Math.floor(Math.random() * demoSources.length)],
          type: "demo",
          data: { x: Math.random(), y: Math.random() }
        };
        io.to(ROOM_VISUALS).emit("visuals:ingest", payload);
      }
    }, 1000);
  }
  startDemoMode();

  socket.on("disconnect", () => {
    console.log(`[BYE] ${socket.data.role || "unknown"}: ${socket.data.clientId || socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});