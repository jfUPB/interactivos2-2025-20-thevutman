let socket;
let currentState = "STATE_A";
let params = {
  STATE_A: { radius: 60, hue: 270, decay: 0.85 },
  STATE_B: { speed: 2, noise: 0.2, thickness: 4 },
  STATE_C: { tempo: 120, contrast: 0.5, density: 16 }
};

window.onload = () => {
  socket = io();
  socket.emit("registerRole", { role: "remote" });

  // Estado
  const stateBtns = document.querySelectorAll("#state-buttons button");
  stateBtns.forEach(btn => {
    btn.onclick = () => {
      setState(btn.dataset.state);
      stateBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    if (btn.dataset.state === currentState) btn.classList.add("active");
  });

  // Sliders
  renderSliders();

  // Palabra clave
  const wordInput = document.getElementById("wordInput");
  const sendWordBtn = document.getElementById("sendWordBtn");
  sendWordBtn.onclick = sendWord;
  wordInput.addEventListener("keydown", e => { if (e.key === "Enter") sendWord(); });

  function sendWord() {
    const word = wordInput.value.trim();
    if (word.length > 0) {
      socket.emit("remote:word", { word });
      wordInput.value = "";
    }
  }
};

function setState(state) {
  currentState = state;
  socket.emit("remote:changeState", { state });
  renderSliders();
  sendParams();
}

function renderSliders() {
  const paramDiv = document.getElementById("param-sliders");
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
  socket.emit("remote:params", params[currentState]);
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