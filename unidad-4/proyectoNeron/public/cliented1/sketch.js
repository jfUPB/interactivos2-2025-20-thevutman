let socket;
let lastKey = "";
let keyAnim = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30);
  textAlign(CENTER, CENTER);
  textSize(60);

  socket = io();
  socket.emit("registerRole", { role: "cliented1" });
}

function draw() {
  background(30, 30, 40, 220);

  // Visual feedback de la última tecla presionada
  if (keyAnim > 0) {
    fill(200, 200, 255, keyAnim * 2);
    text(lastKey, width / 2, height / 2);
    keyAnim -= 2;
  }

  // Overlay de instrucciones
  fill(255);
  textSize(24);
  text("Presiona cualquier tecla para enviar energía visual", width / 2, height * 0.15);
}

function keyPressed() {
  lastKey = key;
  keyAnim = 100;

  // Envía la tecla y un timestamp al servidor
  socket.emit("client:data", {
    sourceId: "cliented1",
    type: "key",
    data: {
      key: key,
      t: Date.now()
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}