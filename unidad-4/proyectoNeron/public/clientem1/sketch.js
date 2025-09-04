let socket;

window.onload = () => {
  socket = io();
  socket.emit("registerRole", { role: "clientem1" });

  // Botones de control
  document.getElementById("play-btn").onclick = () => {
    socket.emit("clientem1:audio", { type: "play" });
  };
  document.getElementById("pause-btn").onclick = () => {
    socket.emit("clientem1:audio", { type: "pause" });
  };
  document.getElementById("rewind-btn").onclick = () => {
    socket.emit("clientem1:audio", { type: "jump", value: -10 }); // retrocede 10s
  };
  document.getElementById("forward-btn").onclick = () => {
    socket.emit("clientem1:audio", { type: "jump", value: 10 }); // avanza 10s
  };

  // Volumen
  document.getElementById("volume-slider").oninput = (e) => {
    socket.emit("clientem1:audio", { type: "volume", value: parseFloat(e.target.value) });
  };

  // Filtro
  document.getElementById("filter-slider").oninput = (e) => {
    socket.emit("clientem1:audio", { type: "filter", value: parseFloat(e.target.value) });
  };

  // Efecto especial
  document.getElementById("fx-btn").onclick = () => {
    socket.emit("clientem1:audio", { type: "fx", value: "reverb" });
  };
};