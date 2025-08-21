# **Unidad 3**

## 🛠 Fase: Apply

### **Actividad 3**

#### **Video**
[Video de YouTube]()

#### **Códigos**

**Mobile**
``` js
let socket;

function setup() {
    createCanvas(400, 400);
    background(240);
    socket = io();

    // Unirse como mobile2
    socket.emit('join', 'mobile2');
}

// Envía la posición al tocar o arrastrar
function touchMoved() {
    enviarPosicion(mouseX, mouseY);
    return false; // Previene scroll en móvil
}

function mouseDragged() {
    enviarPosicion(mouseX, mouseY);
}

function enviarPosicion(x, y) {
    const data = {
        type: 'touch',
        x: x,
        y: y
    };
    socket.emit('touchPosition', JSON.stringify(data));
}

function draw() {
    background(240);
    fill(100);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Toca y arrastra para mover la figura en Visuals', width/2, height/2);
}
```

**Desktop**
``` js
let socket;

function setup() {
    createCanvas(400, 400);
    background(240);
    socket = io();

    // Unirse como desktop2
    socket.emit('join', 'desktop2');
}

function mouseMoved() {
    enviarPosicion(mouseX, mouseY);
}

function mouseDragged() {
    enviarPosicion(mouseX, mouseY);
}

function enviarPosicion(x, y) {
    const data = {
        type: 'cursor',
        x: x,
        y: y
    };
    socket.emit('cursorPosition', JSON.stringify(data));
}

function draw() {
    background(240);
    fill(100);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Mueve el mouse para cambiar el color en Visuals', width/2, height/2);
}
```

**Visuals**
``` js
let socket;
let estadoActual = 'ninguno';
let valorActual = 0;
let touchX = 200;
let touchY = 200;
let cursorX = 0;
let cursorY = 0;

function setup() {
    createCanvas(400, 400);
    socket = io();

    socket.emit('join', 'visuals');

    socket.on('message', (msg) => {
        const data = JSON.parse(msg);
        if (data.estado) {
            estadoActual = data.estado;
            valorActual = data.valor;
        }
    });

    socket.on('touchPosition', (msg) => {
        const data = JSON.parse(msg);
        if (data.type === 'touch') {
            touchX = data.x;
            touchY = data.y;
        }
    });

    socket.on('cursorPosition', (msg) => {
        const data = JSON.parse(msg);
        if (data.type === 'cursor') {
            cursorX = data.x;
            cursorY = data.y;
        }
    });
}

function draw() {
    background(220);
    textSize(20);
    textAlign(CENTER, CENTER);

    let colorR = map(cursorX, 0, width, 0, 255);
    let colorG = map(cursorY, 0, height, 0, 255);
    let colorB = 150;

    if (estadoActual === 'estado1') {
        fill(colorR, colorG, colorB);        ellipse(touchX, touchY, valorActual + 50, valorActual + 50);
        text('Estado 1', width/2, 50);
    } else if (estadoActual === 'estado2') {
        fill(colorR, colorG, colorB);
        rect(touchX, touchY, valorActual + 50, valorActual + 50);
        text('Estado 2', width/2, 50);
    } else if (estadoActual === 'estado3') {
        fill(colorR, colorG, colorB);        
        triangle(
            touchX, touchY - valorActual,         // vértice superior
            touchX - 50, touchY + 50,             // vértice inferior izquierdo
            touchX + 50, touchY + 50              // vértice inferior derecho
        );        
        text('Estado 3', width/2, 50);
    } else {
        fill(0);
        text('Esperando estado...', width/2, height/2);
    }

    textSize(16);
    text('Valor: ' + valorActual, width/2, height - 30);
}
```

**Server**
``` js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); 
const io = socketIO(server); 
const port = 3000;
let counter = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');
    console.log(counter++);

    // El cliente debe enviar su rol al conectarse
    socket.on('join', (role) => {
        socket.join(role);
        console.log(`Client joined room: ${role}`);
    });

    // Solo el controlador puede cambiar el estado
    socket.on('changeState', (message) => {
        // Envía a visuals, desktop2 y mobile2
        io.to('visuals').emit('message', message);
        io.to('desktop2').emit('message', message);
        io.to('mobile2').emit('message', message);
        console.log(`Controller sent state change: ${message}`);
    });

    // Recibe posición touch de mobile2 y la reenvía a visuals
    socket.on('touchPosition', (message) => {
        io.to('visuals').emit('touchPosition', message);
        console.log(`Touch position sent to visuals: ${message}`);
    });

    socket.on('cursorPosition', (message) => {
        io.to('visuals').emit('cursorPosition', message);
        console.log(`Cursor position sent to visuals: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
```

**Controller**
``` js
let socket;

function setup() {
    noCanvas();
    socket = io();

    // Unirse como controlador
    socket.emit('join', 'controlador');

    createButton('Estado 1').position(10, 60).mousePressed(() => cambiarEstado('estado1'));
    createButton('Estado 2').position(110, 60).mousePressed(() => cambiarEstado('estado2'));
    createButton('Estado 3').position(210, 60).mousePressed(() => cambiarEstado('estado3'));
}

function cambiarEstado(estado) {
    console.log(`Cambiando estado a: ${estado}`);
    const parametros = {
        estado: estado,
        valor: Math.floor(Math.random() * 100)
    };
    socket.emit('changeState', JSON.stringify(parametros));
}
```
