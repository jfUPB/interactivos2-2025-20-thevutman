let socket;
let currentState = "STATE_A";
let params = {
  STATE_A: { radius: 60, hue: 270, decay: 0.85 },
  STATE_B: { speed: 2, noise: 0.2, thickness: 4 },
  STATE_C: { tempo: 120, contrast: 0.5, density: 16 }
};

window.onload = () => {
  socket = io();
  socket.emit("registerRole", { role: "clientem2" });

  // Sliders dinámicos según estado
  renderSliders();

  // Área táctil
  const touchCanvas = document.getElementById("touch-canvas");
  touchCanvas.width = touchCanvas.offsetWidth;
  touchCanvas.height = touchCanvas.offsetHeight;

  touchCanvas.addEventListener("pointerdown", sendTouch);
  touchCanvas.addEventListener("pointermove", (e) => {
    if (e.buttons) sendTouch(e);
  });

  function sendTouch(e) {
    const rect = touchCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    socket.emit("clientem2:touch", { x, y, state: currentState });
    drawTouch(x, y);
  }

  function drawTouch(x, y) {
    const ctx = touchCanvas.getContext("2d");
    ctx.clearRect(0, 0, touchCanvas.width, touchCanvas.height);
    ctx.fillStyle = "#ffd6a0";
    ctx.beginPath();
    ctx.arc(x * touchCanvas.width, y * touchCanvas.height, 18, 0, 2 * Math.PI);
    ctx.fill();
  }
};

function renderSliders() {
  const paramDiv = document.getElementById("param-controls");
  paramDiv.innerHTML = "";
  for (let key in params[currentState]) {
    const group = document.createElement("div");
    group.className = "param-group";
    const label = document.createElement("label");
    label.className = "param-label";
    label.textContent = `${key}: ${params[currentState][key]}`;
    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "param-slider";
    slider.min = getMin(key);
    slider.max = getMax(key);
    slider.step = 0.01;
    slider.value = params[currentState][key];
    slider.oninput = (e) => {
      params[currentState][key] = parseFloat(e.target.value);
      label.textContent = `${key}: ${params[currentState][key]}`;
      sendParams();
    };
    group.appendChild(label);
    group.appendChild(slider);
    paramDiv.appendChild(group);
  }
}

function sendParams() {
  socket.emit("clientem2:params", params[currentState]);
}

function getMin(key) {
  return {
    radius: 10, hue: 250, decay: 0.6,
    speed: 0.5, noise: 0, thickness: 1,
    tempo: 20, contrast: 0, density: 6
  }[key] || 0;
}
function getMax(key) {
  return {
    radius: 120, hue: 295, decay: 0.95,
    speed: 10, noise: 0.6, thickness: 10,
    tempo: 240, contrast: 1, density: 40
  }[key] || 1;
}